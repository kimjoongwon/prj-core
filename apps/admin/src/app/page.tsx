'use client'

import { LoginForm } from '@kimjwally/ui'
import { SignupInput } from '__generated__/graphql'
import { useLocalObservable } from 'mobx-react-lite'

export default function Page() {
  const signupInput = {
    email: '',
    password: '',
    profile: {
      nickname: '',
      phone: '',
    },
  }

  const state: SignupInput = useLocalObservable(() => signupInput)

  return (
    <div>
      <LoginForm state={state} />
    </div>
  )
}
