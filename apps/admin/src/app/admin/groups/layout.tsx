import { TableLayout } from '@components';
import { GroupsPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <GroupsPageProvider>
      <TableLayout>{children}</TableLayout>
    </GroupsPageProvider>
  );
}
