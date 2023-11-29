import { ContainerProps } from '@coc/ui';
import { EditLayout } from '@components';
import { CategoryItemEditPageProvider } from './provider';

export interface UserEditPageProps extends ContainerProps {}

export default function Layout(props: UserEditPageProps) {
  const { children } = props;

  return (
    <CategoryItemEditPageProvider>
      <EditLayout>{children}</EditLayout>
    </CategoryItemEditPageProvider>
  );
}
