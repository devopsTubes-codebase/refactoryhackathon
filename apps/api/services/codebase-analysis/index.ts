import type { CodebaseAnalysis, RawScanResult } from '../../types';

export interface CodebaseAnalysisServiceContract {
  runDeterministicScan(input: { projectId: string; sourcePath: string }): Promise<RawScanResult>;
  enrichAnalysis(input: { projectId: string; rawScan: RawScanResult }): Promise<CodebaseAnalysis>;
}

export interface DeterministicScannerContract {
  scan(input: { projectId: string; sourcePath: string }): Promise<RawScanResult>;
}

export * from './folder-scanner';
export * from './dependency-scanner';
export * from './deterministic-scanner';
export * from './tech-stack-detector';
export * from './exclude-filter';
export * from './context-builder';
export * from './enrichment-boundary';
