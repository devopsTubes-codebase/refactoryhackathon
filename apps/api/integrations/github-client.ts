import simpleGit, { type SimpleGitOptions } from 'simple-git';

import { getBackendConfig } from '../config';

export function createGitClient(baseDir: string) {
  const config = getBackendConfig();

  const options: Partial<SimpleGitOptions> = {
    baseDir,
    maxConcurrentProcesses: 1,
    trimmed: false,
  };

  const git = simpleGit(options);
  git.env('GIT_TERMINAL_PROMPT', '0');
  git.env('GIT_HTTP_LOW_SPEED_TIME', String(Math.ceil(config.github.cloneTimeoutMs / 1000)));

  return git;
}
