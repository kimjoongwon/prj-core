import { TableLayout } from '@components';

export default function Layout(props: { children: React.ReactNode }) {
  console.log('categoryItems/layout.tsx');
  const { children } = props;
  return <TableLayout>{children}</TableLayout>;
}
