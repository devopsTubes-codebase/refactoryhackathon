export interface CodebaseDocPromptInput {
  projectId: string;
  compactContext: string;
  suggestedDocStructure: string[];
  maxPages?: number;
}

export interface CodebaseDocPrompt {
  systemPrompt: string;
  userPrompt: string;
}

export interface CodebaseDocPromptBuilderContract {
  buildPrompt(input: CodebaseDocPromptInput): CodebaseDocPrompt;
}

export class CodebaseDocPromptBuilderStub implements CodebaseDocPromptBuilderContract {
  buildPrompt(input: CodebaseDocPromptInput): CodebaseDocPrompt {
    const maxPages = input.maxPages ?? 6;
    const structureHint =
      input.suggestedDocStructure.length > 0
        ? input.suggestedDocStructure.slice(0, maxPages).map((section) => `- ${section}`).join('\n')
        : '- overview\n- architecture\n- setup';

    return {
      systemPrompt: [
        'You are a technical documentation generator producing living documentation.',
        'Return output as multiple Markdown pages grouped by topic.',
        'Use repository docs such as README files, docs/, ADRs, and PRDs to infer project purpose, users, and constraints.',
        'Treat docs as intent signals, but verify technical and operational claims against code, configuration, scripts, dependencies, and runtime evidence.',
        'Write for developers who need both system understanding and concrete change guidance.',
        'You must include these four top-level documentation pages: Overview, Architecture, API Reference, Security.',
        'Those four pages must be fully populated source-grounded docs, not shallow summaries.',
        'Overview page must explain what the project is for, who it serves, the main user or operator workflows, tech stack, entrypoints, and the most important files with citations to source evidence.',
        'Architecture page must explain how the system runs in practice: runtime components, data/control flow, deployment or execution model, module boundaries, configuration flow, persistence/integration points, and where each part lives in the repository.',
        'API Reference page must document detected routes, handlers, public functions, request/response shapes, CLI commands, or other integration surfaces that are supported by source evidence.',
        'Security page must document authentication, authorization, input validation, secret/config handling, network exposure, dependency/security-sensitive code paths, and notable gaps grounded in source evidence.',
        'After those four pages, add feature/function pages for concrete code modules using headings like "## Proxy Service".',
        'Feature pages must use human-readable feature or function names, not the label "Implementation".',
        'ground every claim in the scanned file paths, dependencies, compact context, and source evidence excerpts.',
        'Do not invent APIs, endpoints, files, or behavior that are not supported by the context.',
        'Each feature page must name the concrete files it documents and explain what is implemented there.',
        'Call out likely entrypoints, key modules, change surfaces, setup commands, and debugging touchpoints whenever the source evidence supports them.',
        'Prefer detailed, useful wiki pages with concrete examples, file references, and implementation details over shallow summaries.',
        `Do not exceed ${maxPages} pages.`,
        'Use exactly one level-2 heading (##) per page.',
      ].join('\n'),
      userPrompt: [
        `Project ID: ${input.projectId}`,
        '',
        'Documentation priorities:',
        '- infer project purpose and likely users from repository docs and source evidence',
        '- explain operational reality from scripts, config, infrastructure, and runtime entrypoints',
        '- make the output useful for developer onboarding and safe code changes',
        '',
        'Suggested sections:',
        structureHint,
        '',
        'Compact context:',
        input.compactContext,
      ].join('\n'),
    };
  }
}
