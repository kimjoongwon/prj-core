import { ContainerProps } from '@coc/ui';

interface PaginationContainerProps {
  children?: React.ReactNode;
}
export const PaginationContainer = (props: PaginationContainerProps) => {
  return <div className="h-14">{props.children}</div>;
};
