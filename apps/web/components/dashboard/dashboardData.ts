export type ImportMethod = {
  id: 'github-actions' | 'git-url' | 'zip-file';
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

export type ProjectStatus = 'ready' | 'syncing';

export type DashboardProject = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  updatedAt: string;
  docsHref: string;
};

export type GenerationStage = {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'active' | 'pending';
};

export type GenerationProgress = {
  projectName: string;
  percent: number;
  currentStage: string;
  stages: GenerationStage[];
  logs: string[];
  filesScanned: string;
  elapsed: string;
};

export const importMethods: ImportMethod[] = [
  {
    id: 'github-actions',
    title: 'Git Action',
    description: 'Automatically sync from your GitHub repository using GitHub Actions integration.',
    actionLabel: 'Import',
    href: '/dashboard?source=github-actions',
  },
  {
    id: 'git-url',
    title: 'Git Url',
    description: 'Generate documentation instantly by pasting your Git repository URL from GitHub, GitLab, or Bitbucket.',
    actionLabel: 'Import',
    href: '/dashboard?source=git-url',
  },
  {
    id: 'zip-file',
    title: 'Zip File',
    description: 'Upload your project as a ZIP file and let AI analyze the codebase to generate structured documentation automatically.',
    actionLabel: 'Upload',
    href: '/dashboard?source=zip-file',
  },
];

export const dashboardProjects: DashboardProject[] = [
  {
    id: 'project-alpha',
    name: 'Project Alpha',
    description: 'Core authentication and user management microservices.',
    status: 'ready',
    tags: ['TypeScript', 'Next.js', 'API'],
    updatedAt: '2h ago',
    docsHref: '/docs/project-alpha',
  },
  {
    id: 'beta-engine',
    name: 'Beta Engine',
    description: 'High-performance data processing and analytics pipeline.',
    status: 'syncing',
    tags: ['Go', 'Kafka'],
    updatedAt: '18m ago',
    docsHref: '/docs/beta-engine',
  },
];

export const generationProgress: GenerationProgress = {
  projectName: 'Project Alpha',
  percent: 72,
  currentStage: 'Extracting code structure',
  stages: [
    {
      id: 'crawl',
      title: 'Repository crawl',
      description: '1,204 files discovered',
      status: 'complete',
    },
    {
      id: 'dependencies',
      title: 'Dependency graph',
      description: 'Import map generated',
      status: 'complete',
    },
    {
      id: 'ast',
      title: 'AST decomposition',
      description: 'Parsing TypeScript modules',
      status: 'active',
    },
    {
      id: 'docs',
      title: 'Documentation synthesis',
      description: 'Waiting for analysis context',
      status: 'pending',
    },
  ],
  logs: [
    '[INFO] Initializing Project Alpha crawler...',
    '[DEBUG] Found 1,204 files in /src',
    '[DEBUG] Skipping .gitignore patterns',
    '[INFO] Resolving dependency graph...',
    '[DEBUG] Node established: core/auth (12 exported methods)',
    '[DEBUG] Node established: ui/components (54 modules)',
    '[INFO] Starting AST decomposition for TypeScript 5.2',
    '[DEBUG] Parsing core/router/middleware.ts ... DONE',
    '[DEBUG] Parsing core/api/client.ts ... DONE',
    "[AI] Generating logical flow diagrams for 'AuthModule'",
    '[DEBUG] Context window: 128k tokens active',
    '[DEBUG] Identifying circular dependencies... None found.',
    "[AI] Creating human-readable summaries for 'InternalDataLake'",
    '[DEBUG] Processing JSDoc blocks in api/endpoints.v1.ts',
    '[DEBUG] 84% documentation coverage achieved for /core',
    '_',
  ],
  filesScanned: '1,204',
  elapsed: '04:32',
};
