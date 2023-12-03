import { EditLayout } from '@components';
import { TimelineEditPageProvider } from './provider';

export interface LayoutProps {
  params: { timelineId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children, modal } = props;

  return (
    <EditLayout>
      <TimelineEditPageProvider>
        {children}
        {modal}
      </TimelineEditPageProvider>
    </EditLayout>
  );
}
