import { TableLayout } from '@components';
import { TimelineItemsPageProvider } from '../../../timelineItems/provider';
import { CoCModal } from '@coc/ui';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <TimelineItemsPageProvider>
      <CoCModal>
        <TableLayout>{children}</TableLayout>
      </CoCModal>
    </TimelineItemsPageProvider>
  );
}
