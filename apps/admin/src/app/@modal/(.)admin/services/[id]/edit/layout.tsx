import { ServiceEditPageProvider } from '@adminPages';
import { CoCModal } from '@coc/ui';
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
