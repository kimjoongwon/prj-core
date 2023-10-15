---
to: src/app/admin/(dashboard)/<%= h.inflection.pluralize(name) %>/layout.tsx
unless_exists: true
---

import { TableLayout } from '@components';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return <TableLayout>{children}</TableLayout>;
}
