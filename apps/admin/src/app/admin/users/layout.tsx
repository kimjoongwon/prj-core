import { TableLayout } from '@components';
import { PageProvider } from './components';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <PageProvider>
      <TableLayout>{children}</TableLayout>
    </PageProvider>
  );
}
