import fs from 'node:fs/promises';
import path from 'node:path';

import AdmZip from 'adm-zip';

import { getBackendConfig } from '../../config';
import type {
  GitHubClonePreparationInput,
  GitHubClonePreparationResult,
  IngestionJob,
  UserPATStorageContract,
} from '../../types';

import { validateGitHubRepositoryIntake } from '../project-intake';

export interface SourceIngestionServiceContract {
  ingestFromZip(input: { projectId: string; zipPath: string }): Promise<{ tempPath: string }>;
  ingestFromGitHub(input: { projectId: string; repositoryUrl: string; patRef?: string }): Promise<{ tempPath: string }>;
}

export interface TempSourcePaths {
  rootPath: string;
  sourcePath: string;
  cleanupAt: number;
}

export interface SourceCleanupSchedule {
  projectId: string;
  tempPath: string;
  cleanupAt: number;
  reason: 'success' | 'failure' | 'ttl-expired';
}

export interface PrivateRepositoryClonePreparationContract {
  prepareGitHubClone(input: GitHubClonePreparationInput): Promise<GitHubClonePreparationResult>;
}

export class PrivateRepositoryClonePreparationService implements PrivateRepositoryClonePreparationContract {
  constructor(private readonly patStorage: UserPATStorageContract) {}

  async prepareGitHubClone(input: GitHubClonePreparationInput): Promise<GitHubClonePreparationResult> {
    const validatedRepo = validateGitHubRepositoryIntake({ repositoryUrl: input.repositoryUrl });

    if (input.providedPAT?.trim()) {
      return {
        repositoryUrl: validatedRepo.repositoryUrl,
        isPrivateClone: true,
        resolvedPAT: input.providedPAT.trim(),
        resolvedFrom: 'provided',
      };
    }

    const resolved = await this.patStorage.resolvePATForUser({
      userId: input.userId,
      patId: input.storedPatId,
    });

    if (!resolved) {
      return {
        repositoryUrl: validatedRepo.repositoryUrl,
        isPrivateClone: false,
        resolvedFrom: 'none',
      };
    }

    return {
      repositoryUrl: validatedRepo.repositoryUrl,
      isPrivateClone: true,
      resolvedPAT: resolved.pat,
      resolvedFrom: 'stored',
      resolvedPatId: resolved.patId,
    };
  }
}

export function createTempSourcePaths(input: {
  projectId: string;
  sourceType: 'zip' | 'github';
  now?: number;
}): TempSourcePaths {
  const config = getBackendConfig();
  const baseTimestamp = input.now ?? Date.now();
  const rootPath = path.join(config.storage.tempPath, input.projectId, String(baseTimestamp));

  return {
    rootPath,
    sourcePath: path.join(rootPath, input.sourceType === 'zip' ? 'extracted' : 'repo'),
    cleanupAt: baseTimestamp + config.storage.cleanupTTL,
  };
}

export async function ensureTempSourcePath(paths: TempSourcePaths): Promise<void> {
  await fs.mkdir(paths.sourcePath, { recursive: true });
}

export async function extractZipToTempStorage(input: {
  zipFilePath: string;
  outputPath: string;
}): Promise<void> {
  const archive = new AdmZip(input.zipFilePath);
  await fs.mkdir(input.outputPath, { recursive: true });
  archive.extractAllTo(input.outputPath, true);
}

export async function cleanupSourcePath(tempPath: string): Promise<void> {
  await fs.rm(tempPath, { recursive: true, force: true });
}

export function isCleanupExpired(cleanupAt: number, now = Date.now()): boolean {
  return cleanupAt <= now;
}

export function createCleanupSchedule(input: {
  projectId: string;
  tempPath: string;
  cleanupAt: number;
  reason: 'success' | 'failure' | 'ttl-expired';
}): SourceCleanupSchedule {
  return input;
}

export function createIngestionJob(input: {
  projectId: string;
  sourceType: 'zip' | 'github';
  tempStoragePath: string;
  status?: IngestionJob['status'];
}): IngestionJob {
  return {
    projectId: input.projectId,
    sourceType: input.sourceType,
    tempStoragePath: input.tempStoragePath,
    status: input.status ?? (input.sourceType === 'zip' ? 'extracting' : 'cloning'),
    startedAt: new Date().toISOString(),
  };
}
