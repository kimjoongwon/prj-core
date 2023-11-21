import { EditLayout } from '@components';
import { SessionEditPageProvider } from './provider';

export interface LayoutProps {
  params: { sessionId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <SessionEditPageProvider>{children}</SessionEditPageProvider>
    </EditLayout>
  );
}
