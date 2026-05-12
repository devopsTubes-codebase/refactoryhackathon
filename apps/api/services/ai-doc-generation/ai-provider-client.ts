import type { GeneratedDocsPage } from '../../types';

export interface AIGenerationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIGenerationRequest {
  projectId: string;
  model: string;
  messages: AIGenerationMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIGenerationResponse {
  projectId: string;
  model: string;
  content: string;
  generatedAt: string;
}

export interface OpenAICompatibleAIClientContract {
  generateText(input: AIGenerationRequest): Promise<AIGenerationResponse>;
}

export interface AIDocumentGenerationOutput {
  pages: GeneratedDocsPage[];
}

export class OpenAICompatibleAIClientStub implements OpenAICompatibleAIClientContract {
  async generateText(input: AIGenerationRequest): Promise<AIGenerationResponse> {
    return {
      projectId: input.projectId,
      model: input.model,
      content: [
        '# Documentation (stub)',
        '',
        'TODO: Replace stubbed AI generation with OpenAI-compatible provider call',
        'after Wave 1 analysis + context assembly is finalized.',
      ].join('\n'),
      generatedAt: new Date().toISOString(),
    };
  }
}
