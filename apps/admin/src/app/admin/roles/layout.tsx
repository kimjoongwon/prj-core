import { TableLayout } from '@components';
import { RolesPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <RolesPageProvider>
      <TableLayout>{children}</TableLayout>
    </RolesPageProvider>
  );
}
