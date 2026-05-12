import { randomUUID } from 'node:crypto';

import type {
  GitHubActionsRegenerateContract,
  GitHubActionsTriggerRequest,
  GitHubActionsTriggerResponse,
  RegenerateDocsRequest,
  RegenerateDocsResponse,
  RegenerateDocsEndpointRequest,
  RegenerateDocsEndpointResponse,
} from '../../types';

export interface RegenerateServiceContract {
  triggerRegeneration(input: RegenerateDocsRequest): Promise<RegenerateDocsResponse>;
}

export interface RegenerateEndpointContract {
  regenerateDocs(input: RegenerateDocsEndpointRequest): Promise<RegenerateDocsEndpointResponse>;
}

export interface RegenerateWorkflowTriggerContract extends GitHubActionsRegenerateContract {
  triggerFromWorkflow(input: GitHubActionsTriggerRequest): Promise<GitHubActionsTriggerResponse>;
}

export class RegenerateServiceStub implements RegenerateServiceContract {
  async triggerRegeneration(input: RegenerateDocsRequest): Promise<RegenerateDocsResponse> {
    return {
      projectId: input.projectId,
      jobId: randomUUID(),
      accepted: true,
    };
  }
}

export class RegenerateWorkflowTriggerStub implements RegenerateWorkflowTriggerContract {
  async triggerFromWorkflow(input: GitHubActionsTriggerRequest): Promise<GitHubActionsTriggerResponse> {
    return {
      accepted: true,
      projectId: input.projectId,
      queuedJobId: randomUUID(),
      triggerSource: 'github-actions',
    };
  }
}
