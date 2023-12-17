import { TableLayout } from '@components';
import { UsersPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <UsersPageProvider>
      <TableLayout>{children}</TableLayout>
    </UsersPageProvider>
  );
}
