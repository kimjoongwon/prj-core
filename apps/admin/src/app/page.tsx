'use client'

import { Button, Checkbox, Input, RadioGroup, Switch } from '@kimjwally/ui'
import { Spacer } from '@nextui-org/react'
import { useLocalObservable } from 'mobx-react-lite'
import Link from 'next/link'
import { LoginForm } from './shared/components/forms/login/LoginForm'
export default function Page() {
  const state = useLocalObservable(() => ({
    isChecked: false,
  }))

  return (
    <div>
      <p className="text-xl">뭔데</p>
      <Link href={'/auth/login'}>
        <Button color="primary">로그인</Button>
      </Link>
      <LoginForm />
      <Spacer y={2} />
      <Button color="secondary">Button</Button>
      <Spacer />
      <Button color="success">Button</Button>
      {/* <Spacer /> */}
      {/* <Spacer /> */}
      {/* <DataGrid data={[]} columns={[]} /> */}
      {/* <Spacer /> */}
      <Checkbox state={state} path="isChecked" />
      {/* <Spacer /> */}
      <Switch />
      {/* <Spacer /> */}
      {/* <RadioGroup /> */}
      <Link href={'/dashboard'}>
        <button>이동</button>
      </Link>
    </div>
  )
}
