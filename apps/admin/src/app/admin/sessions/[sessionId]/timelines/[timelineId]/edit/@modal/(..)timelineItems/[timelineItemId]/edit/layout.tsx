import { EditLayout } from '@components';
import { TimelineItemEditPageProvider } from '../../../../../timelineItems/[timelineItemId]/edit/provider';
import { PageModal } from '@coc/web';

export interface LayoutProps {
  params: { timelineItemId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <PageModal size='full'>
      <EditLayout>
        <TimelineItemEditPageProvider>{children}</TimelineItemEditPageProvider>
      </EditLayout>
    </PageModal>
  );
}
