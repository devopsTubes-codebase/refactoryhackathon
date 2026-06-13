import type {
  AIGenerationRequest,
  AIGenerationResponse,
  OpenAICompatibleAIClientContract,
} from '../services/ai-doc-generation/ai-provider-client';

import { createOpenAIClient } from './openai-client';

export class OpenAICompatibleProviderAdapterStub implements OpenAICompatibleAIClientContract {
  async generateText(input: AIGenerationRequest): Promise<AIGenerationResponse> {
    createOpenAIClient();

    return {
      projectId: input.projectId,
      model: input.model,
      content: [
        '# OpenAI-compatible output stub',
        '',
        'TODO: Execute real chat/completions call after Wave 1 input contracts',
        'for compact context and generation prompt are finalized.',
      ].join('\n'),
      generatedAt: new Date().toISOString(),
    };
  }
}
