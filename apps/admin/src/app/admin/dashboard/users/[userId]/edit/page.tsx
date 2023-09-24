import { UserForm } from '@components'

export default function Page({ userId }: { userId: string }) {
  return (
    <div className="w-unit-9xl">
      <UserForm />
    </div>
  )
}
