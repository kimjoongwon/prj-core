import { TableLayout } from '@components';
import { ServicesPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <ServicesPageProvider>
      <TableLayout>{children}</TableLayout>
    </ServicesPageProvider>
  );
}
