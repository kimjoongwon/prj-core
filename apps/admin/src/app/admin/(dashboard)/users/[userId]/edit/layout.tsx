import { Card } from '@kimjwally/ui'
import { EditLayout } from 'app/shared/components'

export default function Layout(props: { children: React.ReactNode }) {
  return <EditLayout>{props.children}</EditLayout>
}
