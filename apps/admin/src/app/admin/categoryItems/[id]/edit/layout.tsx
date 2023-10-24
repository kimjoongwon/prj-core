import { ContainerProps } from '@coc/ui';
import { EditLayout } from '@components';
import { Provider } from './provider';

export interface UserEditPageProps extends ContainerProps {
  params: { id: string | 'new' };
}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return (
    <Provider>
      {children}
    </Provider>
  );
}
