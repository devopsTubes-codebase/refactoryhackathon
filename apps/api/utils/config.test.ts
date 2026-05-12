import { isAIProviderConfigured, isGeminiEmbeddingConfigured } from '../config';

describe('backend config helpers', () => {
  test('treats placeholder OpenAI API key as unconfigured', () => {
    expect(isAIProviderConfigured({ apiKey: 'changeme-openai-api-key' })).toBe(false);
  });

  test('treats real-looking OpenAI API key as configured', () => {
    expect(isAIProviderConfigured({ apiKey: 'sk-test-key' })).toBe(true);
  });

  test('treats Gemini embedding as configured only when API key is present', () => {
    expect(isGeminiEmbeddingConfigured({ apiKey: '' })).toBe(false);
    expect(isGeminiEmbeddingConfigured({ apiKey: 'test-gemini-key' })).toBe(true);
  });
});
