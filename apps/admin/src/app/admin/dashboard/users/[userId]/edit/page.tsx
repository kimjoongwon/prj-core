import { Card } from '@kimjwally/ui'
import { UserForm } from 'app/shared/components'

export default function Page({ userId }: { userId: string }) {
  const isNew = userId === 'new'

  return (
    <div className="max-w-screen-lg">
      <UserForm />
    </div>
  )
}
