'use client'

import { Button, Input, Switch } from '@kimjwally/ui'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { DocumentType } from '__generated__'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'

import { gql, useMutation } from '@apollo/client'

const SIGNUP = gql(`
  mutation SIGN_UP($data: SignupInput!) {
    signup(data: $data) {
      accessToken
    }
  }
`)

const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      refreshToken
    }
  }
`

// const TEST = gql(`
//   query USERS($data: String!) {
//     user(id: $data) {
//       email
//     }
//   }
// `)

// const test = gql(`
//   query USERS {
//     users {
//       email
//     }
//   }
// `)

function _LoginForm() {
  const state = useLocalObservable(
    () => ({
      username: 'hi',
      test: false,
    }),
    {
      test: false,
    },
  )

  const [test, { loading }] = useMutation(SIGNUP, {
    variables: {
      data: {
        email: 'adasd@asdasd.com',
        password: 'asdasd',
        profile: {
          nickname: 'asdsd',
          phone: 'asdasd',
        },
      },
    },
  })

  const onClick = () => {
    console.log(state.test)
    console.log(state.username)
  }
  console.log('state', state.test)

  return (
    <div>
      <Input state={state} path="username" />
      <Switch state={state} path="test" />
      <Button onPress={onClick}>Test</Button>
    </div>
  )
}

export const LoginForm = observer(_LoginForm)
