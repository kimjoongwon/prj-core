import { EditLayout } from 'app/shared/components/layouts/Edit'

export default function Layout(props: { children: React.ReactNode }) {
  return <EditLayout>{props.children}</EditLayout>
}
