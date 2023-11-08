import { EditLayout } from '@components';
import { WorkspaceEditPageProvider } from './provider';

export interface LayoutProps {
  params: { workspaceId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <WorkspaceEditPageProvider>{children}</WorkspaceEditPageProvider>
    </EditLayout>
  );
}
