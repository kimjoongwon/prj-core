import { TableLayout } from '@components';
import { WorkspacesPageProvider } from './provider';

export default function Layout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const { children, modal } = props;
  return (
    <WorkspacesPageProvider>
      <TableLayout>{children}</TableLayout>
      {modal}
    </WorkspacesPageProvider>
  );
}
