import { EditLayout } from '@components';
import { SpaceEditPageProvider } from './provider';

export interface LayoutProps {
  params: { spaceId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <SpaceEditPageProvider>{children}</SpaceEditPageProvider>
    </EditLayout>
  );
}
