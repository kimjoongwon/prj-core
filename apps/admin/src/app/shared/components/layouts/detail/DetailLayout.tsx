import { ContainerProps } from '@coc/web';

interface DetailLayoutProps extends ContainerProps {}
export const DetailLayout = (props: DetailLayoutProps) => {
  const { children } = props;

  return <div>{children}</div>;
};
