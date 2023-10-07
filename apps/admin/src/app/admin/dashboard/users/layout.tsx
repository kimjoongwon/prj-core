import { TableContainer } from '@components';
import { PageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <PageProvider>
      <TableContainer>{children}</TableContainer>
    </PageProvider>
  );
}
