import { PageModal } from '@coc/web';
import { CategoryItemEditPageProvider } from '../../../../[categoryItemId]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <PageModal>
      <CategoryItemEditPageProvider>{children}</CategoryItemEditPageProvider>
    </PageModal>
  );
}
