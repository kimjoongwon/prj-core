import { EditLayout } from '@components';
import { TimelineItemEditPageProvider } from './provider';

export interface LayoutProps {
  params: { timelineItemId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <TimelineItemEditPageProvider>{children}</TimelineItemEditPageProvider>
    </EditLayout>
  );
}
