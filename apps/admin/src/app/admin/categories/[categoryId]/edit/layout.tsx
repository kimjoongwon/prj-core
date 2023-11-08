import { EditLayout } from '@components';
import { CategoryEditPageProvider } from './provider';

export interface LayoutProps {
  params: { categoryId: string | 'new' };
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <EditLayout>
      <CategoryEditPageProvider>{children}</CategoryEditPageProvider>
    </EditLayout>
  );
}
