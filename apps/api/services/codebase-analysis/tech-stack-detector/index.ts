import type { RawScanResult } from '../../../types';

export interface TechStackDetectorInput {
  projectId: string;
  rawScan: RawScanResult;
}

export interface TechStackDetectorOutput {
  techStack: string[];
}

export interface TechStackDetectorContract {
  infer(input: TechStackDetectorInput): TechStackDetectorOutput;
}

export class TechStackDetectorFallbackStub implements TechStackDetectorContract {
  infer(input: TechStackDetectorInput): TechStackDetectorOutput {
    // TODO(task-5.4): Implement deterministic fallback inference from config files and extensions.
    void input;

    return {
      techStack: ['unknown'],
    };
  }
}
