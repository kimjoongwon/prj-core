import { UserForm } from 'app/shared/components'

export default function Page({ userId }: { userId: string }) {
  const isNew = userId === 'new'

  return (
    <div className="p-7">
      <UserForm />
    </div>
  )
}
