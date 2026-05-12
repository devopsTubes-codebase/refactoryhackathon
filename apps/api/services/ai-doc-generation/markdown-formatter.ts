import type { GeneratedDocsPage } from '../../types';

export interface MarkdownFormattingContract {
  normalize(markdown: string): string;
}

export interface MarkdownPageSplitterContract {
  splitIntoPages(input: { projectId: string; markdown: string }): GeneratedDocsPage[];
}

export class MarkdownFormatterStub implements MarkdownFormattingContract {
  normalize(markdown: string): string {
    return markdown.trim();
  }
}

export class MarkdownPageSplitterStub implements MarkdownPageSplitterContract {
  splitIntoPages(input: { projectId: string; markdown: string }): GeneratedDocsPage[] {
    const normalized = input.markdown.trim();

    if (!normalized) {
      return [
        {
          slug: 'overview',
          title: 'Overview',
          content: 'TODO: Markdown content is empty in stub mode.',
        },
      ];
    }

    return [
      {
        slug: 'overview',
        title: 'Overview',
        content: [
          normalized,
          '',
          '> TODO: Replace single-page splitter with final multi-page strategy once Wave 1',
          '> analysis enrichment output and sectioning heuristics are stable.',
        ].join('\n'),
      },
    ];
  }
}
