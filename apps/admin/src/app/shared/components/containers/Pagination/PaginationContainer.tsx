import { ContainerProps } from '@coc/shared';

interface PaginationContainerProps {
  children?: React.ReactNode;
}
export const PaginationContainer = (props: PaginationContainerProps) => {
  return <div className="h-14">{props.children}</div>;
};
