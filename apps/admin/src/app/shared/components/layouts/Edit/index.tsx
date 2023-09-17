import { Button, Card } from '@kimjwally/ui'

interface EditLayoutProps {
  children: React.ReactNode
}

export const EditLayout = (props: EditLayoutProps) => {
  const { children } = props

  return <div className="flex flex-col items-center">{children}</div>
}
