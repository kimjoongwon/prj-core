import { TableLayout } from '@components';
import { TimelinesPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <TimelinesPageProvider>
      <TableLayout>{children}</TableLayout>
    </TimelinesPageProvider>
  );
}
