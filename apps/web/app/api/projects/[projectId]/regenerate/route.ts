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
  PostgresJobLogStore,
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
  JobLogger,
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
    const jobLogger = new JobLogger({ projectId: project.id, store: new PostgresJobLogStore() });
    const paths = createTempSourcePaths({ projectId: project.id, sourceType: 'github' });

    try {
      await jobLogger.queued('Regeneration job accepted', { triggeredBy: 'manual' });
      await projectStore.updateStatus(project.id, 'cloning');
      await jobLogger.info('cloning', 'Cloning GitHub repository');
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
      await jobLogger.info('cloning', 'GitHub repository cloned', { privateClone: prepared.isPrivateClone });

      await projectStore.updateStatus(project.id, 'scanning');
      await jobLogger.info('scanning', 'Scanning codebase files');
      const codebaseAnalysis = new CodebaseAnalysisService({
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
          onEvent: async (event) => {
            if (event.type === 'start') {
              await jobLogger.info('enriching', 'Starting codebase enrichment');
            } else if (event.type === 'success') {
              await jobLogger.info('enriching', 'Codebase enrichment completed');
            } else {
              await jobLogger.warn('enriching', 'Codebase enrichment fallback used', { reason: event.reason });
            }
          },
        }),
      });
      const rawScan = await codebaseAnalysis.runDeterministicScan({ projectId: project.id, sourcePath: paths.sourcePath });
      await jobLogger.info('scanning', 'Scanned codebase files', {
        fileCount: rawScan.fileCount,
        configCount: rawScan.configFiles.length,
        dependencyCount: Object.keys(rawScan.dependencies).length,
      });
      const analysis = await codebaseAnalysis.enrichAnalysis({ projectId: project.id, rawScan });

      await projectStore.updateStatus(project.id, 'generating');
      await jobLogger.info('generating', 'Generating documentation pages');
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
      await jobLogger.info('generating', 'Generated documentation pages', {
        pageCount: docs.pages.length,
        sidebarCount: docs.sidebar.length,
        hasSecondarySidebar: Boolean(docs.secondarySidebar),
      });

      await jobLogger.info('indexing', 'Indexing generated documentation');
      const semanticIndex = await buildSemanticIndex({
        projectId: project.id,
        model: config.ai.embeddingModel,
        summary: analysis.compactContext,
        docs: docs.pages,
        embeddingGenerator: new OpenAICompatibleEmbeddingGenerator(new OpenAI({ apiKey: config.ai.apiKey, baseURL: config.ai.baseURL })),
        vectorIndexStore: vectorStore,
      });
      await jobLogger.info('indexing', 'Indexed generated documentation', { chunkCount: semanticIndex.chunkCount });
      await projectStore.updateStatus(project.id, 'completed');
      await jobLogger.info('cleanup', 'Cleaning temporary source storage');
      await cleanupSourcePath(paths.rootPath);
      await jobLogger.completed('Regeneration completed');
    } catch (error) {
      await projectStore.updateStatus(project.id, 'failed');
      await jobLogger.failed(error instanceof Error ? error.name : 'UNKNOWN');
      await jobLogger.info('cleanup', 'Cleaning temporary source storage after failure');
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
