import { VStack } from '../../VStack';

interface TableContainerProps {
  children: React.ReactNode;
}

export const TableContainer = (props: TableContainerProps) => {
  const { children } = props;
  return <VStack>{children}</VStack>;
};
