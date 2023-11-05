import { CoCModal, ContainerProps } from '@coc/ui';
import { EditLayout } from '@components';
import { Provider } from './provider';

export interface UserEditPageProps extends ContainerProps {}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return (
    <Provider>
      <EditLayout>{children}</EditLayout>
    </Provider>
  );
}
