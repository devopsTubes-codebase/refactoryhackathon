export type DocsReaderPage = {
  slug: string;
  title: string;
  content: string;
};

export type DocsReaderSidebarItem = {
  title: string;
  slug: string;
  href: string;
  active?: boolean;
  children?: DocsReaderSidebarItem[];
};

export type DocsReaderModel = {
  projectId: string;
  projectName: string;
  version: string;
  breadcrumbs: string[];
  title: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
  sidebar: DocsReaderSidebarItem[];
  previous: { label: string; href: string };
  next: { label: string; href: string };
};

export type GeneratedDocsInput = {
  projectId: string;
  pages: DocsReaderPage[];
  sidebar: Array<{ title: string; slug: string; children?: Array<{ title: string; slug: string; children?: Array<{ title: string; slug: string }> }> }>;
  version: number;
};

export function buildDocsReaderModel(input: { docs: GeneratedDocsInput; activeSlug?: string }): DocsReaderModel {
  const flatSidebar = flattenSidebar(input.docs.sidebar);
  const fallbackSlug = flatSidebar[0]?.slug ?? input.docs.pages[0]?.slug ?? 'overview';
  const activeSlug = input.activeSlug ?? fallbackSlug;
  const page = input.docs.pages.find((candidate) => candidate.slug === activeSlug) ?? input.docs.pages.find((candidate) => candidate.slug === fallbackSlug) ?? input.docs.pages[0];

  const currentIndex = flatSidebar.findIndex((item) => item.slug === page?.slug);
  const previous = flatSidebar[Math.max(0, currentIndex - 1)] ?? flatSidebar[0];
  const next = flatSidebar[currentIndex + 1] ?? flatSidebar[currentIndex] ?? flatSidebar[0];

  return {
    projectId: input.docs.projectId,
    projectName: input.docs.projectId.slice(0, 8),
    version: `v${input.docs.version} generated`,
    breadcrumbs: ['Docs', input.docs.projectId.slice(0, 8), page?.title ?? 'Generated Docs'],
    title: page?.title ?? 'Generated Docs',
    intro: extractIntro(page?.content ?? ''),
    sections: extractSections(page?.content ?? ''),
    sidebar: input.docs.sidebar.map((item) => mapSidebarItem(item, input.docs.projectId, activeSlug)),
    previous: {
      label: previous?.title ?? 'Overview',
      href: previous ? `/docs/${input.docs.projectId}/${previous.slug}` : `/docs/${input.docs.projectId}`,
    },
    next: {
      label: next?.title ?? 'Overview',
      href: next ? `/docs/${input.docs.projectId}/${next.slug}` : `/docs/${input.docs.projectId}`,
    },
  };
}

function mapSidebarItem(
  item: GeneratedDocsInput['sidebar'][number],
  projectId: string,
  activeSlug: string,
): DocsReaderSidebarItem {
  const children = item.children?.map((child) => mapSidebarItem(child, projectId, activeSlug));
  return {
    title: item.title,
    slug: item.slug,
    href: `/docs/${projectId}/${item.slug}`,
    active: item.slug === activeSlug,
    children,
  };
}

function flattenSidebar(items: GeneratedDocsInput['sidebar']): Array<{ title: string; slug: string }> {
  return items.flatMap((item) => [
    { title: item.title, slug: item.slug },
    ...flattenSidebar(item.children ?? []),
  ]);
}

function extractIntro(content: string): string {
  const firstParagraph = content
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith('#'));
  return firstParagraph ?? 'Generated documentation for this project.';
}

function extractSections(content: string): Array<{ heading: string; body: string }> {
  const sections = content
    .split(/\n(?=##\s+)/)
    .map((section) => section.trim())
    .filter(Boolean)
    .map((section) => {
      const [headingLine, ...bodyLines] = section.split('\n');
      const heading = headingLine.replace(/^#+\s*/, '').trim();
      const body = bodyLines.join('\n').replace(/^#+\s.*$/gm, '').trim();
      return { heading, body: body || 'Generated section content.' };
    })
    .filter((section) => section.heading);

  return sections.length ? sections : [{ heading: 'Generated content', body: content.replace(/^#+\s.*$/gm, '').trim() || 'Generated documentation content.' }];
}
