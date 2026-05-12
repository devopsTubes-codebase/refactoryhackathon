import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from 'node:crypto';

import { getBackendConfig } from '../../config';
import type {
  DeleteUserPATInput,
  DocsHistoryStoreContract,
  DocsRetrievalServiceContract,
  DocumentationStoreContract,
  GeneratedDocs,
  ResolveUserPATInput,
  ResolvedUserPAT,
  RevokeUserPATInput,
  RetrievedDocumentation,
  StoreUserPATInput,
  UserPAT,
  UserPATStorageContract,
} from '../../types';

import { InMemoryDocsHistoryStoreStub, InMemoryDocumentationStoreStub } from './documentation-store';

export interface StorageServiceContract {
  saveCurrentDocs(input: GeneratedDocs): Promise<void>;
  appendDocsHistory(input: GeneratedDocs): Promise<void>;
}

const userPATsByUser = new Map<string, UserPAT[]>();

function getEncryptionKey(): Buffer {
  const config = getBackendConfig();

  if (config.encryption.algorithm !== 'aes-256-gcm') {
    throw new Error('Unsupported encryption algorithm for PAT storage');
  }

  const rawKey = config.encryption.secretKey;
  const keyBuffer = Buffer.from(rawKey, 'utf8');

  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_SECRET_KEY must be exactly 32 bytes for aes-256-gcm');
  }

  return keyBuffer;
}

function encryptPAT(plainToken: string): { encryptedPAT: string; ivHex: string; authTagHex: string } {
  if (!plainToken.trim()) {
    throw new Error('PAT is required');
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainToken, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedPAT: encrypted.toString('base64'),
    ivHex: iv.toString('hex'),
    authTagHex: authTag.toString('hex'),
  };
}

function decryptPAT(record: UserPAT): string {
  const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(record.ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(record.authTagHex, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(record.encryptedPAT, 'base64')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

function findOwnedPATRecord(input: { userId: string; patId: string }): UserPAT {
  const current = userPATsByUser.get(input.userId) ?? [];
  const record = current.find((item) => item.id === input.patId);

  if (!record) {
    throw new Error('PAT record not found for user');
  }

  return record;
}

export class InMemoryEncryptedPATStorageService implements UserPATStorageContract {
  async storePAT(input: StoreUserPATInput): Promise<{ patId: string }> {
    const normalizedUserId = input.userId.trim();
    const normalizedPAT = input.pat.trim();

    if (!normalizedUserId) {
      throw new Error('User id is required');
    }

    if (!normalizedPAT) {
      throw new Error('PAT is required');
    }

    const now = new Date().toISOString();
    const encrypted = encryptPAT(normalizedPAT);
    const patId = randomUUID();
    const record: UserPAT = {
      id: patId,
      userId: normalizedUserId,
      encryptedPAT: encrypted.encryptedPAT,
      ivHex: encrypted.ivHex,
      authTagHex: encrypted.authTagHex,
      githubUsername: input.githubUsername,
      createdAt: now,
      updatedAt: now,
    };

    const current = userPATsByUser.get(normalizedUserId) ?? [];
    current.push(record);
    userPATsByUser.set(normalizedUserId, current);

    return { patId };
  }

  async resolvePATForUser(input: ResolveUserPATInput): Promise<ResolvedUserPAT | null> {
    const normalizedUserId = input.userId.trim();
    if (!normalizedUserId) {
      throw new Error('User id is required');
    }

    const records = userPATsByUser.get(normalizedUserId) ?? [];
    const active = records.filter((item) => !item.revokedAt);
    const record = input.patId
      ? active.find((item) => item.id === input.patId)
      : active.at(-1);

    if (!record) {
      return null;
    }

    const now = new Date().toISOString();
    record.lastUsedAt = now;
    record.updatedAt = now;

    return {
      patId: record.id,
      pat: decryptPAT(record),
    };
  }

  async revokePAT(input: RevokeUserPATInput): Promise<void> {
    const normalizedUserId = input.userId.trim();
    if (!normalizedUserId) {
      throw new Error('User id is required');
    }

    const record = findOwnedPATRecord({ userId: normalizedUserId, patId: input.patId });
    record.revokedAt = new Date().toISOString();
    record.updatedAt = record.revokedAt;
  }

  async deletePAT(input: DeleteUserPATInput): Promise<void> {
    const normalizedUserId = input.userId.trim();
    if (!normalizedUserId) {
      throw new Error('User id is required');
    }

    const records = userPATsByUser.get(normalizedUserId) ?? [];
    const next = records.filter((item) => item.id !== input.patId);

    if (next.length === records.length) {
      throw new Error('PAT record not found for user');
    }

    userPATsByUser.set(normalizedUserId, next);
  }
}

export interface DocsPersistenceServiceContract {
  docsStore: DocumentationStoreContract;
  docsHistoryStore: DocsHistoryStoreContract;
}

export class DocumentationRetrievalServiceStub implements DocsRetrievalServiceContract {
  constructor(private readonly docsStore: DocumentationStoreContract) {}

  async getDocumentation(projectId: string): Promise<RetrievedDocumentation | null> {
    return this.docsStore.getCurrentDocs(projectId);
  }
}

export function createDocsPersistenceStubs(): DocsPersistenceServiceContract {
  return {
    docsStore: new InMemoryDocumentationStoreStub(),
    docsHistoryStore: new InMemoryDocsHistoryStoreStub(),
  };
}

export * from './documentation-store';
