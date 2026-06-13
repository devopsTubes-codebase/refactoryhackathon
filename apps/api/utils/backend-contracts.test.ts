import {
  createDataResponse,
  toDocumentationRetrievalResponse,
  toProjectStatusResponse,
  toRegenerateDocsApiResponse,
} from './backend-contracts';
import type { Project, RetrievedDocumentation, RegenerateDocsEndpointResponse } from '../types';

describe('backend UI contract helpers', () => {
  test('builds source input, status polling, docs retrieval, and regenerate response envelopes', () => {
    const project: Project = {
      id: 'project-1',
      userId: 'user-1',
      ownership: {
        ownerUserId: 'user-1',
        createdBy: 'user-1',
      },
      name: 'Demo Project',
      sourceType: 'github',
      sourceInput: 'https://github.com/example/repo',
      status: 'generating',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:10:00.000Z',
    };

    const docs: RetrievedDocumentation = {
      projectId: 'project-1',
      pages: [{ slug: 'overview', title: 'Overview', content: '# Overview' }],
      sidebar: [{ slug: 'overview', title: 'Overview' }],
      generatedAt: '2026-01-01T00:10:00.000Z',
      version: 2,
    };

    const regenerate: RegenerateDocsEndpointResponse = {
      projectId: 'project-1',
      accepted: true,
      jobId: 'job-1',
      requestedAt: '2026-01-01T00:10:00.000Z',
    };

    expect(createDataResponse(project)).toEqual({ data: project });
    expect(toProjectStatusResponse(project)).toEqual({
      data: {
        projectId: 'project-1',
        status: 'generating',
        updatedAt: '2026-01-01T00:10:00.000Z',
      },
    });
    expect(toDocumentationRetrievalResponse(docs)).toEqual({ data: docs });
    expect(toRegenerateDocsApiResponse(regenerate)).toEqual({ data: regenerate });
  });
});
