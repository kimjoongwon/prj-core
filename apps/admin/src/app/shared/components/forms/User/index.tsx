'use client'

import { Input } from '@kimjwally/ui'
import { EditLayout } from '../../layouts/Edit'
import { useLocalObservable } from 'mobx-react-lite'

export const UserForm = () => {
  const state = useLocalObservable(() => ({
    username: '',
  }))
  return (
    <EditLayout>
      <Input label="username" state={state} path="username" />
    </EditLayout>
  )
}
