import { TableLayout } from '@components';
import { TimelineItemsPageProvider } from '../../../timelineItems/provider';
import { PageModal } from '@coc/web';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <TimelineItemsPageProvider>
      <PageModal isDismissable closeButton>
        <TableLayout>{children}</TableLayout>
      </PageModal>
    </TimelineItemsPageProvider>
  );
}
