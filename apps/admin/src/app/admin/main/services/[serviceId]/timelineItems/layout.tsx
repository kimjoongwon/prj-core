import { Container } from '@shared/frontend';

type TimelineItemsLayoutProps = {
  children: React.ReactNode;
};

const TimelineItemsLayout = ({ children }: TimelineItemsLayoutProps) => {
  return <Container className="h-full">{children}</Container>;
};

export default TimelineItemsLayout;
