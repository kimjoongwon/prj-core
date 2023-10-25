import { CoCModal } from '@coc/ui';
import { Provider } from '../../../../../admin/categories/[id]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <CoCModal>
      <Provider>{children}</Provider>
    </CoCModal>
  );
}
