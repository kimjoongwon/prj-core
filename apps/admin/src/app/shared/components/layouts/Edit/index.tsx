import { Button, Card } from '@kimjwally/ui'

interface EditLayoutProps {
  children: React.ReactNode
}

export const EditLayout = (props: EditLayoutProps) => {
  const { children } = props

  return (
    <div className="flex flex-col items-center">
      {children}
      <div className="space-x-4 space-y-4">
        <Button>생성</Button>
        <Button>수정</Button>
      </div>
    </div>
  )
}
