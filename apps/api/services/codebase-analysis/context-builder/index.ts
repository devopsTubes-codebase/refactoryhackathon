import type { CodebaseAnalysis, RawScanResult } from '../../../types';

export interface CompactContextBuilderInput {
  projectId: string;
  rawScan: RawScanResult;
  techStack: string[];
  importantFiles: string[];
  suggestedDocStructure: string[];
}

export interface CompactContextBuilderOutput {
  compactContext: string;
  tokenEstimate: number;
}

export interface CompactContextBuilderContract {
  build(input: CompactContextBuilderInput): CompactContextBuilderOutput;
}

export interface CompactContextTokenLimiter {
  maxTokens: number;
  enforce(input: { text: string; maxTokens: number }): { text: string; tokenEstimate: number };
}

export class CompactContextBuilderStub implements CompactContextBuilderContract {
  constructor(private readonly tokenLimiter: CompactContextTokenLimiter = new MaxTokenLimiterStub(2000)) {}

  build(input: CompactContextBuilderInput): CompactContextBuilderOutput {
    const seed = [
      `projectId=${input.projectId}`,
      `fileCount=${input.rawScan.fileCount}`,
      `techStack=${input.techStack.join(', ')}`,
      `importantFiles=${input.importantFiles.slice(0, 20).join(', ')}`,
      `docSections=${input.suggestedDocStructure.join(' | ')}`,
    ].join('\n');

    // TODO(task-5.5): Build compact, grounded context from analysis without raw source dumping.
    const enforced = this.tokenLimiter.enforce({
      text: seed,
      maxTokens: this.tokenLimiter.maxTokens,
    });

    return {
      compactContext: enforced.text,
      tokenEstimate: enforced.tokenEstimate,
    };
  }
}

export class MaxTokenLimiterStub implements CompactContextTokenLimiter {
  constructor(public readonly maxTokens: number) {}

  enforce(input: { text: string; maxTokens: number }): { text: string; tokenEstimate: number } {
    // TODO(task-5.5): Replace char-based approximation with tokenizer-aligned counting.
    const safeText = input.text.slice(0, input.maxTokens * 4);
    const tokenEstimate = Math.ceil(safeText.length / 4);

    return {
      text: safeText,
      tokenEstimate,
    };
  }
}

export function attachCompactContextToAnalysis(input: {
  base: Omit<CodebaseAnalysis, 'compactContext'>;
  compactContext: string;
}): CodebaseAnalysis {
  return {
    ...input.base,
    compactContext: input.compactContext,
  };
}
