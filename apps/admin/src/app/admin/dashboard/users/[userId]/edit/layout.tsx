import { EditLayout } from '@components';
import { ContainerProps } from '@kimjwally/ui';
import { PageProvider } from './providers/page';

export interface UserEditPageProps extends ContainerProps {
  params: { userId: string | 'new' };
}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return (
    <EditLayout>
      <PageProvider>{children}</PageProvider>
    </EditLayout>
  );
}
