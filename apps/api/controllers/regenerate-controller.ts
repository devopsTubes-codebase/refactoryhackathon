import type {
  RegenerateDocsEndpointRequest,
  RegenerateDocsEndpointResponse,
  RegenerateDocsRequest,
} from '../types';

export type RegenerateDocsInput = RegenerateDocsRequest;

export interface RegenerateController {
  regenerateDocs(input: RegenerateDocsEndpointRequest): Promise<RegenerateDocsEndpointResponse>;
}
