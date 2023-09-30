'use client'

import { UserForm } from '@components'
import { usePage } from './providers/page/hooks/usePage'
import { UserEditPageProps } from './layout'

export default function Page({ params: { userId } }: UserEditPageProps) {
  const page = usePage()

  return (
    <div className="w-unit-9xl">
      <UserForm schema={page.form.schema} state={page.form.state} />
    </div>
  )
}
