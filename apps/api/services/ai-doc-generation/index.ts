import type {
  DocsHistoryStoreContract,
  GeneratedDocs,
  GeneratedDocsPage,
  GeneratedSidebarItem,
} from '../../types';

import type {
  AIGenerationRequest,
  AIGenerationResponse,
  OpenAICompatibleAIClientContract,
} from './ai-provider-client';
import type { MarkdownFormattingContract, MarkdownPageSplitterContract } from './markdown-formatter';
import type { CodebaseDocPrompt, CodebaseDocPromptBuilderContract, CodebaseDocPromptInput } from './prompt-builder';
import type { SidebarGenerationContract } from './sidebar-generator';

export interface AIDocGenerationServiceContract {
  generateDocs(input: { projectId: string; compactContext: string }): Promise<GeneratedDocs>;
}

export interface AIDocGenerationPipelineContract {
  aiClient: OpenAICompatibleAIClientContract;
  promptBuilder: CodebaseDocPromptBuilderContract;
  markdownFormatter: MarkdownFormattingContract;
  pageSplitter: MarkdownPageSplitterContract;
  sidebarGenerator: SidebarGenerationContract;
  docsHistoryStore: DocsHistoryStoreContract;
}

export interface AIDocGenerationPreparedArtifacts {
  prompt: CodebaseDocPrompt;
  modelInput: AIGenerationRequest;
  modelOutput: AIGenerationResponse;
  pages: GeneratedDocsPage[];
  sidebar: GeneratedSidebarItem[];
}

export function createAIDocGenerationPipelineStub(input: AIDocGenerationPipelineContract): AIDocGenerationPipelineContract {
  return input;
}

export function buildAIDocPromptStub(
  builder: CodebaseDocPromptBuilderContract,
  input: CodebaseDocPromptInput,
): CodebaseDocPrompt {
  return builder.buildPrompt(input);
}

export async function runAIDocGenerationPipelineStub(input: {
  pipeline: AIDocGenerationPipelineContract;
  projectId: string;
  model: string;
  compactContext: string;
  suggestedDocStructure: string[];
}): Promise<AIDocGenerationPreparedArtifacts> {
  const prompt = input.pipeline.promptBuilder.buildPrompt({
    projectId: input.projectId,
    compactContext: input.compactContext,
    suggestedDocStructure: input.suggestedDocStructure,
  });

  const modelInput: AIGenerationRequest = {
    projectId: input.projectId,
    model: input.model,
    messages: [
      { role: 'system', content: prompt.systemPrompt },
      { role: 'user', content: prompt.userPrompt },
    ],
  };

  const modelOutput = await input.pipeline.aiClient.generateText(modelInput);
  const formattedMarkdown = input.pipeline.markdownFormatter.normalize(modelOutput.content);
  const pages = input.pipeline.pageSplitter.splitIntoPages({
    projectId: input.projectId,
    markdown: formattedMarkdown,
  });
  const sidebar = input.pipeline.sidebarGenerator.generateSidebar({
    projectId: input.projectId,
    pages,
  });

  // TODO(Wave 1 dependency): history retention behavior must be finalized
  // after current-doc persistence and versioning source-of-truth are implemented.

  return {
    prompt,
    modelInput,
    modelOutput,
    pages,
    sidebar,
  };
}

export * from './ai-provider-client';
export * from './markdown-formatter';
export * from './prompt-builder';
export * from './sidebar-generator';
