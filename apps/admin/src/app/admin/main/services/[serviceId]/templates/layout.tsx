import { Container } from '@shared/frontend';

type TemplatesLayoutProps = {
  children: React.ReactNode;
};

const TemplatesLayout = ({ children }: TemplatesLayoutProps) => {
  return <Container className="h-full">{children}</Container>;
};

export default TemplatesLayout;
