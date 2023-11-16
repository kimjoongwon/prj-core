import { TableLayout } from '@components';
import { SpacesPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <SpacesPageProvider>
      <TableLayout>{children}</TableLayout>
    </SpacesPageProvider>
  );
}
