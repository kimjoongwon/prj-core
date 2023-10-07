import { EditLayout } from '@components';
import { ContainerProps } from '@coc/ui';
import { PageProvider } from './provider';

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
