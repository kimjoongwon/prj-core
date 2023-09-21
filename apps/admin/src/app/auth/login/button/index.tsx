'use client'

import React from 'react'
import { useMutation } from '@apollo/client'
import { Button } from '@kimjwally/ui'
import { gql } from '__generated__/gql'
import { loginPage } from '../page'
import { useCoCRouter } from '@hooks'

export const LOGIN = gql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      refreshToken
    }
  }
`)
export default function LoginButton() {
  const router = useCoCRouter()

  const [login, { loading }] = useMutation(LOGIN)

  const onClickLogin = () => {
    login({
      variables: { data: loginPage.login.form },
      onCompleted(data) {
        localStorage.setItem('accessToken', data.login.accessToken)
        localStorage.setItem('accessToken', data.login.refreshToken)

        router.push({
          url: '/admin/dashboard/users',
        })
      },
    })
  }

  return (
    <Button isLoading={loading} onClick={onClickLogin}>
      Login
    </Button>
  )
}
