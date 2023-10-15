---
to: src/app/admin/(dashboard)/<%= h.inflection.pluralize(name) %>/page.tsx
unless_exists: true
---

import { PageProvider, Page } from './components';

export default function <%= h.inflection.pluralize(name) %>Page() {
  return (
    <PageProvider>
      <Page />
    </PageProvider>
  );
}