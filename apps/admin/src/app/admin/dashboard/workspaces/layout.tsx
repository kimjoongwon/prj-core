import { PageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  return <PageProvider>{props.children}</PageProvider>;
}
