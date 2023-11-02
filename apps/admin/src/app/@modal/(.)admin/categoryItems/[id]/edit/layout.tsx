import { CoCModal } from '@coc/ui';
import { Provider } from '../../../../../admin/categoryItems/[categoryItemId]/edit/provider';
interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <CoCModal>
      <Provider>{children}</Provider>
    </CoCModal>
  );
}
