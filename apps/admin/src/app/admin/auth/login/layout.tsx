import { Container, Layout } from '@shared/frontend';

type LayoutProps = {
  children: React.ReactNode;
};

export default function LoginLayout(props: LayoutProps) {
  return <Container>{props.children}</Container>;
}
