import { TableLayout } from '@components';
import { PageProvider } from './provider';

export default function Layout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const { children, modal } = props;
  console.log('categoryItems');
  return (
    <PageProvider>
      <TableLayout>{children}</TableLayout>
      {modal}
    </PageProvider>
  );
}
