import type { EnrichedAnalysis, RawScanResult } from '../../types';
import type { CompactContextBuilderContract } from './context-builder';
import type { TechStackDetectorContract } from './tech-stack-detector';

export interface EnrichmentPromptSections {
  context: string;
  goal: string;
  downstream: string;
  request: string;
}

export interface EnrichmentPromptBuilderContract {
  build(input: { projectId: string; rawScan: RawScanResult }): EnrichmentPromptSections;
}

export interface AgentEnrichmentSpawnerContract {
  spawn(input: {
    projectId: string;
    prompt: EnrichmentPromptSections;
    rawScan: RawScanResult;
    timeoutMs: number;
  }): Promise<EnrichedAnalysis>;
}

export interface EnrichmentFallbackContext {
  projectId: string;
  rawScan: RawScanResult;
  reason: 'timeout' | 'failure' | 'invalid-response';
  message: string;
}

export interface EnrichmentFallbackStrategyContract {
  build(context: EnrichmentFallbackContext): EnrichedAnalysis;
}

export interface AgentEnrichmentBoundaryContract {
  enrich(input: { projectId: string; rawScan: RawScanResult }): Promise<EnrichedAnalysis>;
}

export interface AgentEnrichmentBoundaryDependencies {
  promptBuilder: EnrichmentPromptBuilderContract;
  spawner: AgentEnrichmentSpawnerContract;
  fallback: EnrichmentFallbackStrategyContract;
  timeoutMs?: number;
}

export class StructuredPromptBuilderStub implements EnrichmentPromptBuilderContract {
  build(input: { projectId: string; rawScan: RawScanResult }): EnrichmentPromptSections {
    // TODO(task-5.3): Expand with complete structured data while keeping prompts bounded.
    return {
      context: `Raw scan completed for ${input.projectId} with ${input.rawScan.fileCount} files.`,
      goal: 'Enrich raw scan with intelligent analysis for documentation generation.',
      downstream: 'Output will feed AI documentation generation context and section planning.',
      request:
        'Infer tech stack, prioritize important files, produce compact context (<=2000 tokens), and suggest documentation structure.',
    };
  }
}

export class AgentEnrichmentBoundaryStub implements AgentEnrichmentBoundaryContract {
  private readonly timeoutMs: number;

  constructor(private readonly deps: AgentEnrichmentBoundaryDependencies) {
    this.timeoutMs = deps.timeoutMs ?? 15_000;
  }

  async enrich(input: { projectId: string; rawScan: RawScanResult }): Promise<EnrichedAnalysis> {
    const prompt = this.deps.promptBuilder.build({
      projectId: input.projectId,
      rawScan: input.rawScan,
    });

    try {
      // TODO(task-5.3): Wire actual async agent orchestration and response parsing.
      return await this.deps.spawner.spawn({
        projectId: input.projectId,
        prompt,
        rawScan: input.rawScan,
        timeoutMs: this.timeoutMs,
      });
    } catch (error) {
      return this.deps.fallback.build({
        projectId: input.projectId,
        rawScan: input.rawScan,
        reason: 'failure',
        message: error instanceof Error ? error.message : 'Unknown enrichment error',
      });
    }
  }
}

export class EnrichmentFallbackStrategyStub implements EnrichmentFallbackStrategyContract {
  constructor(
    private readonly techStackDetector: TechStackDetectorContract,
    private readonly contextBuilder: CompactContextBuilderContract,
  ) {}

  build(context: EnrichmentFallbackContext): EnrichedAnalysis {
    // TODO(task-5.4): Add smarter important-file prioritization fallback and richer reasoning metadata.
    const inferred = this.techStackDetector.infer({
      projectId: context.projectId,
      rawScan: context.rawScan,
    });

    const compact = this.contextBuilder.build({
      projectId: context.projectId,
      rawScan: context.rawScan,
      techStack: inferred.techStack,
      importantFiles: [],
      suggestedDocStructure: ['Overview', 'Architecture', 'Key Modules'],
    });

    return {
      techStack: inferred.techStack,
      importantFiles: [],
      compactContext: compact.compactContext,
      suggestedDocStructure: ['Overview', 'Architecture', 'Key Modules'],
      enrichmentDuration: 0,
      agentUsed: false,
    };
  }
}

export class AgentSpawnerNotImplementedStub implements AgentEnrichmentSpawnerContract {
  async spawn(_input: {
    projectId: string;
    prompt: EnrichmentPromptSections;
    rawScan: RawScanResult;
    timeoutMs: number;
  }): Promise<EnrichedAnalysis> {
    // TODO(task-5.3): Replace with real enrichment agent call and timeout handling.
    throw new Error('Agent enrichment spawner is not implemented in prep scope.');
  }
}
