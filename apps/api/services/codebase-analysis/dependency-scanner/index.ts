import type { ConfigFileCandidate } from '../folder-scanner';

export interface DependencyScannerInput {
  projectId: string;
  sourcePath: string;
  configCandidates: ConfigFileCandidate[];
}

export interface DependencyScannerOutput {
  dependencies: Record<string, string>;
}

export interface DependencyScannerContract {
  scan(input: DependencyScannerInput): Promise<DependencyScannerOutput>;
}

export class DependencyScannerStub implements DependencyScannerContract {
  async scan(input: DependencyScannerInput): Promise<DependencyScannerOutput> {
    // TODO(task-5.1): Parse dependencies deterministically from known config formats.
    // TODO(task-5.1): Keep extraction pure and stable; no AI inference in this phase.
    void input;

    return {
      dependencies: {},
    };
  }
}
