import { EditLayout } from '@components';
import { TimelineItemEditPageProvider } from '../../../../../timelineItems/[timelineItemId]/edit/provider';
import { CoCModal } from '@coc/ui';

export interface LayoutProps {
  params: { timelineItemId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <CoCModal size='full'>
      <EditLayout>
        <TimelineItemEditPageProvider>{children}</TimelineItemEditPageProvider>
      </EditLayout>
    </CoCModal>
  );
}
