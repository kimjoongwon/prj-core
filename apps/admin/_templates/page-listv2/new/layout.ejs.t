---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/layout.tsx
unless_exists: true
---

import { TableLayout } from '@components';
import { <%= Name %>sPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <<%= Name %>sPageProvider>
      <TableLayout>{children}</TableLayout>
    </<%= Name %>sPageProvider>
  );
}
