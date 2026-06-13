import type { Project, RegenerateDocsEndpointResponse, RetrievedDocumentation } from '../types';

export function createDataResponse<T>(data: T): { data: T } {
  return { data };
}

export function toProjectStatusResponse(project: Project): {
  data: { projectId: string; status: Project['status']; updatedAt: string };
} {
  return {
    data: {
      projectId: project.id,
      status: project.status,
      updatedAt: project.updatedAt,
    },
  };
}

export function toDocumentationRetrievalResponse(docs: RetrievedDocumentation): { data: RetrievedDocumentation } {
  return createDataResponse(docs);
}

export function toRegenerateDocsApiResponse(
  response: RegenerateDocsEndpointResponse,
): { data: RegenerateDocsEndpointResponse } {
  return createDataResponse(response);
}
