import { ContainerProps } from '@kimjwally/ui';

interface DetailLayoutProps extends ContainerProps {}
export const DetailLayout = (props: DetailLayoutProps) => {
  const { children } = props;

  return <div>{children}</div>;
};
