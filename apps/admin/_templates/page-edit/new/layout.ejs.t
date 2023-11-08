---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/layout.tsx
---
import { EditLayout } from '@components';
import { <%= Name %>EditPageProvider } from './provider';

export interface LayoutProps {
  params: { <%= name %>Id: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <<%= Name %>EditPageProvider>{children}</<%= Name %>EditPageProvider>
    </EditLayout>
  );
}
