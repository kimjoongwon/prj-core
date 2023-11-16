import { EditLayout } from '@components';
import { GroupEditPageProvider } from './provider';

export interface LayoutProps {
  params: { groupId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <GroupEditPageProvider>{children}</GroupEditPageProvider>
    </EditLayout>
  );
}
