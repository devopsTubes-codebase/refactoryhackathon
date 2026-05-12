import type { RawScanResult } from '../../../types';
import type { ExcludeFilterContract } from '../exclude-filter';

export interface FileTreeNode {
  path: string;
  kind: 'file' | 'directory';
}

export interface ConfigFileCandidate {
  path: string;
  type: RawScanResult['configFiles'][number]['type'];
}

export interface FolderScannerInput {
  projectId: string;
  sourcePath: string;
}

export interface FolderScannerOutput {
  fileTree: FileTreeNode[];
  folderStructure: string[];
  configCandidates: ConfigFileCandidate[];
  excludedPaths: string[];
}

export interface FolderScannerContract {
  scan(input: FolderScannerInput): Promise<FolderScannerOutput>;
}

export interface FolderScannerDependencies {
  excludeFilter: ExcludeFilterContract;
}

export class FolderScannerStub implements FolderScannerContract {
  constructor(private readonly deps: FolderScannerDependencies) {}

  async scan(input: FolderScannerInput): Promise<FolderScannerOutput> {
    const shouldExclude = this.deps.excludeFilter.shouldExcludePath(input.sourcePath);

    // TODO(task-5.1): Implement deterministic recursive traversal with stable ordering.
    // TODO(task-5.2): Apply exclude filter at directory and file boundaries.
    void shouldExclude;

    return {
      fileTree: [],
      folderStructure: [],
      configCandidates: [],
      excludedPaths: [],
    };
  }
}
