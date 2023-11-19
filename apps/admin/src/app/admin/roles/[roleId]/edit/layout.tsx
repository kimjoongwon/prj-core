import { EditLayout } from '@components';
import { RoleEditPageProvider } from './provider';

export interface LayoutProps {
  params: { roleId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <RoleEditPageProvider>{children}</RoleEditPageProvider>
    </EditLayout>
  );
}
