import { Container } from '@shared/frontend';

type SessionsLayoutProps = {
  children: React.ReactNode;
};

const SessionsLayout = ({ children }: SessionsLayoutProps) => {
  return <Container className="h-full">{children}</Container>;
};

export default SessionsLayout;
