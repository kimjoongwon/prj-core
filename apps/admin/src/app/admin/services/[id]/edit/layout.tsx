import { ContainerProps } from '@coc/ui';
import { ServiceEditPageProvider } from './provider';

export interface UserEditPageProps extends ContainerProps {
  params: { id: string | 'new' };
}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return <ServiceEditPageProvider>{children}</ServiceEditPageProvider>;
}
