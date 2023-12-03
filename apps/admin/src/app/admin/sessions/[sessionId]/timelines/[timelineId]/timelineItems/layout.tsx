import { TableLayout } from '@components';
import { TimelineItemsPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <TimelineItemsPageProvider>
      <TableLayout>{children}</TableLayout>
    </TimelineItemsPageProvider>
  );
}
