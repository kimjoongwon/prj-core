import { PageProvider } from './providers/page'

export default function Layout(props: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return <PageProvider>{props.children}</PageProvider>
}
