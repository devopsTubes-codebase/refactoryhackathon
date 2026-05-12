import OpenAI from 'openai';
import {
  AgentEnrichmentBoundary,
  buildSemanticIndex,
  cleanupSourcePath,
  cloneGitHubRepositoryToTempStorage,
  CodebaseAnalysisService,
  CodebaseDocPromptBuilderStub,
  CompactContextBuilder,
  createAIDocGenerationPipelineStub,
  createAIDocGenerationService,
  createOpenAIClient,
  createRegenerateDocsEndpointService,
  DependencyScanner,
  DeterministicScanner,
  EnrichmentFallbackStrategy,
  FolderScanner,
  getBackendConfig,
  HeuristicAgentEnrichmentSpawner,
  initializePostgresSchema,
  MarkdownFormatterStub,
  MarkdownPageSplitterStub,
  OpenAICompatibleAIClient,
  OpenAICompatibleEmbeddingGenerator,
  PostgresDocumentationStore,
  PostgresPATStore,
  PostgresProjectStore,
  PostgresVectorIndexStore,
  PrivateRepositoryClonePreparationService,
  SidebarGeneratorStub,
  StandardExcludeFilter,
  StructuredPromptBuilder,
  TechStackDetectorFallback,
  toBackendErrorResponse,
  toRegenerateDocsApiResponse,
  createTempSourcePaths,
} from '@codebase-wiki/api';
import { NextResponse } from 'next/server';
import { getRequiredSessionIdentity, UnauthorizedError } from '@/lib/auth/session';

export async function POST(request: Request, context: { params: { projectId: string } }) {
  try {
    const identity = await getRequiredSessionIdentity();
    const body = (await request.json().catch(() => ({}))) as { providedPAT?: string; storedPatId?: string };
    await initializePostgresSchema();

    const projectStore = new PostgresProjectStore();
    const project = await projectStore.getProject(context.params.projectId);
    if (!project || project.ownership.ownerUserId !== identity.userId) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }, { status: 404 });
    }

    const endpoint = createRegenerateDocsEndpointService({
      triggerService: { async triggerRegeneration(input) { return { projectId: input.projectId, jobId: crypto.randomUUID(), accepted: true }; } },
      getProjectById: (projectId) => projectStore.getProject(projectId),
    });
    const accepted = await endpoint.regenerateDocs({
      projectId: project.id,
      triggeredBy: 'manual',
      requestedByUserId: identity.userId,
    });

    if (project.sourceType !== 'github') {
      return NextResponse.json(toRegenerateDocsApiResponse(accepted), { status: 202 });
    }

    const config = getBackendConfig();
    const docsStore = new PostgresDocumentationStore();
    const vectorStore = new PostgresVectorIndexStore();
    const paths = createTempSourcePaths({ projectId: project.id, sourceType: 'github' });

    try {
      await projectStore.updateStatus(project.id, 'cloning');
      const prepared = await new PrivateRepositoryClonePreparationService(new PostgresPATStore()).prepareGitHubClone({
        userId: identity.userId,
        repositoryUrl: project.sourceInput,
        providedPAT: body.providedPAT,
        storedPatId: body.storedPatId,
      });
      await cloneGitHubRepositoryToTempStorage({
        repositoryUrl: prepared.repositoryUrl,
        outputPath: paths.sourcePath,
        pat: prepared.resolvedPAT,
      });

      await projectStore.updateStatus(project.id, 'scanning');
      const analysis = await new CodebaseAnalysisService({
        deterministicScanner: new DeterministicScanner({
          folderScanner: new FolderScanner({ excludeFilter: new StandardExcludeFilter() }),
          dependencyScanner: new DependencyScanner(),
        }),
        enrichmentBoundary: new AgentEnrichmentBoundary({
          promptBuilder: new StructuredPromptBuilder(),
          spawner: new HeuristicAgentEnrichmentSpawner({
            techStackDetector: new TechStackDetectorFallback(),
            contextBuilder: new CompactContextBuilder(),
          }),
          fallback: new EnrichmentFallbackStrategy(new TechStackDetectorFallback(), new CompactContextBuilder()),
        }),
      }).analyze({ projectId: project.id, sourcePath: paths.sourcePath });

      await projectStore.updateStatus(project.id, 'generating');
      const docs = await createAIDocGenerationService({
        pipeline: createAIDocGenerationPipelineStub({
          aiClient: new OpenAICompatibleAIClient(createOpenAIClient()),
          promptBuilder: new CodebaseDocPromptBuilderStub(),
          markdownFormatter: new MarkdownFormatterStub(),
          pageSplitter: new MarkdownPageSplitterStub(),
          sidebarGenerator: new SidebarGeneratorStub(),
          docsHistoryStore: docsStore,
        }),
        docsStore,
        docsHistoryStore: docsStore,
        model: config.ai.model,
        suggestedDocStructure: analysis.suggestedDocStructure,
      }).generateDocs({ projectId: project.id, compactContext: analysis.compactContext });

      await buildSemanticIndex({
        projectId: project.id,
        model: config.ai.embeddingModel,
        summary: analysis.compactContext,
        docs: docs.pages,
        embeddingGenerator: new OpenAICompatibleEmbeddingGenerator(new OpenAI({ apiKey: config.ai.apiKey, baseURL: config.ai.baseURL })),
        vectorIndexStore: vectorStore,
      });
      await projectStore.updateStatus(project.id, 'completed');
      await cleanupSourcePath(paths.rootPath);
    } catch (error) {
      await projectStore.updateStatus(project.id, 'failed');
      await cleanupSourcePath(paths.rootPath);
      throw error;
    }

    return NextResponse.json(toRegenerateDocsApiResponse(accepted), { status: 202 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Authentication is required for this endpoint' } }, { status: 401 });
    }

    const response = toBackendErrorResponse(error, 'Failed to regenerate documentation');
    return NextResponse.json(response.body, { status: response.status });
  }
}
