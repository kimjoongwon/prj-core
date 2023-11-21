import { TableLayout } from '@components';
import { SessionsPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <SessionsPageProvider>
      <TableLayout>{children}</TableLayout>
    </SessionsPageProvider>
  );
}
