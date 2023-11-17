import { TableLayout } from '@components';
import { SpacesPageProvider } from './provider';

export default function Layout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const { children, modal } = props;
  return (
    <SpacesPageProvider>
      <TableLayout>{children}</TableLayout>
      {modal}
    </SpacesPageProvider>
  );
}
