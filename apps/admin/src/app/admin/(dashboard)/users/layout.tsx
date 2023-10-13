import { TableLayout } from '@components';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  console.log('test');
  return <TableLayout>{children}</TableLayout>;
}
