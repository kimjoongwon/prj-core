import { TableLayout } from '@components';
import { WorkspacesPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <WorkspacesPageProvider>
      <TableLayout>{children}</TableLayout>
    </WorkspacesPageProvider>
  );
}
