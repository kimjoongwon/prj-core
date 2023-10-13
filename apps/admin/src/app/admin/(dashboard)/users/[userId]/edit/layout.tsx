import { ContainerProps } from '@coc/ui';
import { EditLayout } from '@components';

export interface UserEditPageProps extends ContainerProps {
  params: { userId: string | 'new' };
}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return <EditLayout>{children}</EditLayout>;
}
