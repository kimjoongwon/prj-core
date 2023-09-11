import { Card } from '@kimjwally/ui'

interface EditLayoutProps {
  children: React.ReactNode
}

export const EditLayout = (props: EditLayoutProps) => {
  const { children } = props
  return <Card>{children}</Card>
}
