import assert from 'node:assert/strict';

import { buildDocsReaderModel } from './docsViewModel';

const model = buildDocsReaderModel({
  docs: {
    projectId: 'project-12345678',
    version: 2,
    pages: [
      { slug: 'overview', title: 'Overview', content: '## Overview\n\nOverview body' },
      { slug: 'proxy-service', title: 'Proxy Service', content: '## Proxy Service\n\nProxy body' },
    ],
    sidebar: [
      { title: 'Overview', slug: 'overview', children: [] },
      {
        title: 'Features',
        slug: 'features',
        children: [{ title: 'Proxy Service', slug: 'proxy-service', children: [] }],
      },
    ],
  },
  activeSlug: 'proxy-service',
});

assert.equal(model.title, 'Proxy Service');
assert.equal(model.sidebar[1]?.title, 'Features');
assert.equal(model.sidebar[1]?.children?.[0]?.active, true);
assert.equal(model.previous.label, 'Features');
assert.equal(model.next.label, 'Proxy Service');

console.log('docsViewModel tests passed');
