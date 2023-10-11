import { TableLayout } from '@components';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return <TableLayout>{children}</TableLayout>;
}
