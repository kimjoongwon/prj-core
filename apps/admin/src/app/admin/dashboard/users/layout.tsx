import { UsersPageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  return <UsersPageProvider>{props.children}</UsersPageProvider>;
}
