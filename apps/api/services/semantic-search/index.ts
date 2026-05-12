import type {
  ChatRetrievalContract,
  ChatRetrievalRequest,
  ChatRetrievalResponse,
  EmbeddingChunk,
  EmbeddingGeneratorContract,
  EmbeddingGenerationRequest,
  EmbeddingGenerationResponse,
  GroundedKnowledgeSource,
  SemanticIndexBuildRequest,
  SemanticIndexBuildResult,
  VectorIndexStoreContract,
  VectorIndexUpsertRequest,
  VectorIndexUpsertResult,
} from '../../types';

export interface SemanticSearchServiceContract {
  buildIndex(input: SemanticIndexBuildRequest): Promise<SemanticIndexBuildResult>;
}

export interface SemanticSearchPrepContract {
  embeddingGenerator: EmbeddingGeneratorContract;
  vectorIndexStore: VectorIndexStoreContract;
  retrieval: ChatRetrievalContract;
}

export class NotImplementedEmbeddingGenerator implements EmbeddingGeneratorContract {
  async generateEmbeddings(input: EmbeddingGenerationRequest): Promise<EmbeddingGenerationResponse> {
    const embeddings: EmbeddingChunk[] = input.chunks.map((chunk) => ({
      chunkId: chunk.chunkId,
      text: chunk.text,
      embedding: [],
      metadata: chunk.metadata,
    }));

    return {
      projectId: input.projectId,
      model: input.model,
      embeddings,
      generatedAt: new Date().toISOString(),
    };
  }
}

export class InMemoryVectorIndexStoreStub implements VectorIndexStoreContract {
  async upsertIndex(input: VectorIndexUpsertRequest): Promise<VectorIndexUpsertResult> {
    return {
      projectId: input.projectId,
      indexedAt: new Date().toISOString(),
      chunkCount: input.embeddings.length,
    };
  }
}

export class GroundedDocsRetrievalStub implements ChatRetrievalContract {
  async retrieveContext(input: ChatRetrievalRequest): Promise<ChatRetrievalResponse> {
    const sources: GroundedKnowledgeSource[] = input.allowedSources.map((source) => ({
      source,
      reference:
        source === 'generated-docs'
          ? `generated-docs:${input.projectId}`
          : source === 'vector-index'
            ? `vector-index:${input.projectId}`
            : `codebase-summary:${input.projectId}`,
      relevanceScore: 0,
      excerpt: '',
    }));

    return {
      projectId: input.projectId,
      query: input.query,
      groundedOnly: true,
      sources,
      context: '',
    };
  }
}
