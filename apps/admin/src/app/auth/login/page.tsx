'use client'

import { Container, LoginForm } from '@kimjwally/ui'
import { observable } from 'mobx'
import LoginButton from './button'

export const loginPage = observable({
  login: {
    form: {
      email: '',
      password: '',
    },
  },
})

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center">
      <Container style={{ width: 500 }}>
        <LoginForm buttons={<LoginButton />} state={loginPage.login.form} />
      </Container>
    </div>
  )
}
