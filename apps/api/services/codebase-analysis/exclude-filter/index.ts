export interface ExcludeFilterContract {
  shouldExcludePath(path: string): boolean;
  listDefaultExcludes(): readonly string[];
}

export interface ExcludeFilterOptions {
  extraPatterns?: string[];
}

const DEFAULT_EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
] as const;

export class StandardExcludeFilterStub implements ExcludeFilterContract {
  private readonly patterns: readonly string[];

  constructor(options: ExcludeFilterOptions = {}) {
    this.patterns = [...DEFAULT_EXCLUDE_PATTERNS, ...(options.extraPatterns ?? [])];
  }

  shouldExcludePath(path: string): boolean {
    // TODO(task-5.2): Replace simple substring checks with normalized segment-based matching.
    return this.patterns.some((pattern) => path.includes(pattern));
  }

  listDefaultExcludes(): readonly string[] {
    return this.patterns;
  }
}
