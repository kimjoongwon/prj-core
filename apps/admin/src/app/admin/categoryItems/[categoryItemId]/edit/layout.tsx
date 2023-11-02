import { ContainerProps } from '@coc/ui';
import { Provider } from './provider';

export interface UserEditPageProps extends ContainerProps {}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return <Provider>{children}</Provider>;
}
