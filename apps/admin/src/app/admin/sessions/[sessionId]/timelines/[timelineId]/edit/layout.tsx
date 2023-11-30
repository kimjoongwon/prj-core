import { EditLayout } from '@components';
import { TimelineEditPageProvider } from './provider';

export interface LayoutProps {
  params: { timelineId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <TimelineEditPageProvider>{children}</TimelineEditPageProvider>
    </EditLayout>
  );
}
