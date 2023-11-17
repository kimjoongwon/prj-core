---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/@modals/(..)<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/layout.tsx
---
import { CoCModal } from '@coc/ui';
import { <%= Name %>EditPageProvider } from '../../../../[<%= name %>Id]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <CoCModal>
      <<%= Name %>EditPageProvider>{children}</<%= Name %>EditPageProvider>
    </CoCModal>
  );
}
