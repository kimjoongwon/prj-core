import { VStack } from '../../VStack';

interface TableContainerProps {
  children: React.ReactNode;
}

export const TableContainer = (props: TableContainerProps) => {
  const { children } = props;
  return <VStack className="w-full p-4 space-y-3">{children}</VStack>;
};
