import OpenAI from 'openai';

import { getBackendConfig } from '../config';

export function createOpenAIClient(): OpenAI {
  const config = getBackendConfig();

  return new OpenAI({
    apiKey: config.ai.apiKey,
    baseURL: config.ai.baseURL,
  });
}
