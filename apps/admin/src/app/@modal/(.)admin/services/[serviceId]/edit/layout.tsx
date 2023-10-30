import { CoCModal } from '@coc/ui';
import { ServiceEditPageProvider } from '../../../../../admin/services/[serviceId]/edit/provider';
interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <CoCModal>
      <ServiceEditPageProvider>{children}</ServiceEditPageProvider>
    </CoCModal>
  );
}
