import { EditLayout } from '@components';
import { ContainerProps } from '@kimjwally/ui';
import { UserEditPageProvider } from './provider';

export interface UserEditPageProps extends ContainerProps {
  params: { userId: string | 'new' };
}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return (
    <EditLayout>
      <UserEditPageProvider>{children}</UserEditPageProvider>
    </EditLayout>
  );
}
