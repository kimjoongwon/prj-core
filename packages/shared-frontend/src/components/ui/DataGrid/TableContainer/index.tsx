import { Container } from '../../Container';

interface TableContainerProps {
  children: React.ReactNode;
}

export const TableContainer = (props: TableContainerProps) => {
  const { children } = props;
  return <Container className="p-4 space-y-3">{children}</Container>;
};
