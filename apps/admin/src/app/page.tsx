'use client'

import { LoginForm } from '@kimjwally/ui'
import { Button } from '@nextui-org/react'
import { SignupInput } from '__generated__/graphql'
import { useLocalObservable } from 'mobx-react-lite'
import Link from 'next/link'

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
    <Link href="auth/login">
      <p>진입 경로입니다.</p>
    </Link>
  )
}
