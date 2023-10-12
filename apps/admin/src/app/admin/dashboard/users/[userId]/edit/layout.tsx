import { ContainerProps } from '@coc/ui';
import { EditLayout } from '../../../../../shared/components/layouts/Edit';

export interface UserEditPageProps extends ContainerProps {
  params: { userId: string | 'new' };
}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return <EditLayout>{children}</EditLayout>;
}
