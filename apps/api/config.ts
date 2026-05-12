export interface BackendConfig {
  database: {
    url: string;
  };
  ai: {
    provider: 'openai';
    apiKey: string;
    baseURL: string;
    model: string;
    embeddingModel: string;
  };
  gemini: {
    apiKey: string;
    baseURL: string;
    embeddingModel: string;
  };
  github: {
    cloneTimeoutMs: number;
    defaultBranch: string;
  };
  upload: {
    maxZipSize: number;
  };
  storage: {
    tempPath: string;
    cleanupTTL: number;
    docsPath: string;
    vectorIndexPath: string;
  };
  encryption: {
    algorithm: string;
    secretKey: string;
  };
}

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getNumberEnv(name: string, fallback: number): number {
  const rawValue = process.env[name];

  if (!rawValue || rawValue.trim() === '') {
    return fallback;
  }

  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${name} must be a positive number`);
  }

  return parsed;
}

function getOptionalEnv(name: string, fallback = ''): string {
  const value = process.env[name] ?? fallback;
  return value.trim();
}

const config: BackendConfig = {
  database: {
    url: getEnv('DATABASE_URL', 'changeme_database_url'),
  },
  ai: {
    provider: 'openai',
    apiKey: getEnv('OPENAI_API_KEY', 'changeme-openai-api-key'),
    baseURL: getEnv('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
    model: getEnv('AI_MODEL', 'gpt-4-turbo-preview'),
    embeddingModel: getEnv('AI_EMBEDDING_MODEL', 'text-embedding-3-small'),
  },
  gemini: {
    apiKey: getOptionalEnv('GEMINI_API_KEY'),
    baseURL: getEnv('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
    embeddingModel: getEnv('GEMINI_EMBEDDING_MODEL', 'text-embedding-004'),
  },
  github: {
    cloneTimeoutMs: getNumberEnv('GITHUB_CLONE_TIMEOUT', 300000),
    defaultBranch: getEnv('GITHUB_DEFAULT_BRANCH', 'main'),
  },
  upload: {
    maxZipSize: getNumberEnv('MAX_ZIP_SIZE', 52428800),
  },
  storage: {
    tempPath: getEnv('TEMP_STORAGE_PATH', '/tmp/codebase-wiki'),
    cleanupTTL: getNumberEnv('CLEANUP_TTL', 1800000),
    docsPath: getEnv('DOCS_STORAGE_PATH', '/tmp/codebase-wiki-docs'),
    vectorIndexPath: getEnv('VECTOR_INDEX_PATH', '/tmp/codebase-wiki-index'),
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    secretKey: getEnv('ENCRYPTION_SECRET_KEY', 'changeme-encryption-secret-key-32-chars'),
  },
};

export function getBackendConfig(): BackendConfig {
  return config;
}

export function isAIProviderConfigured(input: Pick<BackendConfig['ai'], 'apiKey'>): boolean {
  return input.apiKey.trim() !== '' && input.apiKey !== 'changeme-openai-api-key';
}

export function isGeminiEmbeddingConfigured(input: Pick<BackendConfig['gemini'], 'apiKey'>): boolean {
  return input.apiKey.trim() !== '';
}

export default config;
