export interface AuthServiceContract {
  validateSession(sessionToken: string): Promise<{ userId: string } | null>;
}
