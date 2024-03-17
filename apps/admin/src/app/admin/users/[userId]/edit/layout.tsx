import { ContainerProps } from '@coc/web';
import { EditLayout } from '@components';
import { Provider } from './provider';

export interface UserEditPageProps extends ContainerProps {
  params: { userId: string | 'new' };
}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return (
    <Provider>
      <EditLayout>{children}</EditLayout>
    </Provider>
  );
}
