import { TableLayout } from '@components';
import { Provider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <Provider>
      <TableLayout>{children}</TableLayout>
    </Provider>
  );
}
