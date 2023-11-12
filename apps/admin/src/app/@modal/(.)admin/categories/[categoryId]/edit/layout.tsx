import { CoCModal } from '@coc/ui';
import { CategoryEditPageProvider } from '../../../../../admin/categories/[categoryId]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <CoCModal>
      <CategoryEditPageProvider>{children}</CategoryEditPageProvider>
    </CoCModal>
  );
}
