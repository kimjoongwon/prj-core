import { CoCModal } from '@coc/ui';
import { CategoryItemEditPageProvider } from '../../../../[categoryItemId]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <CoCModal>
      <CategoryItemEditPageProvider>{children}</CategoryItemEditPageProvider>
    </CoCModal>
  );
}
