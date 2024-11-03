import { Container } from '@shared/frontend';

type LayoutProps = {
  children: React.ReactNode;
};

export default function LoginLayout(props: LayoutProps) {
  return props.children;
}
