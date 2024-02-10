import { PageModal } from '@coc/shared';
import { ServiceEditPageProvider } from '../../../../../admin/services/[serviceId]/edit/provider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <PageModal>
      <ServiceEditPageProvider>{children}</ServiceEditPageProvider>
    </PageModal>
  );
}
