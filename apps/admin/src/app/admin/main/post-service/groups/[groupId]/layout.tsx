import { DetailLayout } from '@shared/frontend';

interface GroupLayoutProps {
  children: React.ReactNode;
}
const GroupPageLayout = (props: GroupLayoutProps) => {
  const { children } = props;
  return <DetailLayout>{children}</DetailLayout>;
};

export default GroupPageLayout;
