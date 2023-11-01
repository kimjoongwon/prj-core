import { ContainerProps } from '@coc/ui';
import { EditLayout } from '@components';
import { Provider } from './provider';

export interface UserEditPageProps extends ContainerProps {
  params: { id: string | 'new' };
  modal: React.ReactNode;
}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return (
    <EditLayout>
      <Provider>{children}</Provider>
    </EditLayout>
  );
}
