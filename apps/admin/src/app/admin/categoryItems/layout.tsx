import { TableLayout } from '@components';
import { PageProvider } from './_components';

export default function Layout(props: { children: React.ReactNode }) {
  console.log('categoryItems/layout.tsx');
  const { children } = props;
  return (
    <PageProvider>
      <TableLayout>{children}</TableLayout>
    </PageProvider>
  );
}
