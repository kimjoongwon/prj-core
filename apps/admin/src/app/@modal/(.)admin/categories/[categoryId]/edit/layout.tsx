import { PageModal } from '@coc/web';
import { CategoryEditPageProvider } from '../../../../../admin/categories/[categoryId]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <PageModal>
      <CategoryEditPageProvider>{children}</CategoryEditPageProvider>
    </PageModal>
  );
}
