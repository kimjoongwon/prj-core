'use client'

import { FormControl, FormGroupControl, Input } from '@kimjwally/ui'
import { useLocalObservable } from 'mobx-react-lite'
import { z } from 'zod'
import { SaveButton } from '../../buttons/save/SaveButton'
import { useMutation } from '@apollo/client'
import { gql } from '__generated__'
import { useCoCRouter } from 'app/shared/hooks/useCoCRouter'

export const SIGN_UP = gql(`#graphql
  mutation SignUp($signUpInput: SignupInput!) {
    signup(data: $signUpInput) {
      user {
        id
        email
      }
    }
  }
`)

export function UserForm() {
  const router = useCoCRouter()
  const state = useLocalObservable(() => ({
    email: 'email18@gmail.com',
    password: 'rkdmf12!@',
    profile: {
      nickname: '닉네임18',
      phone: '0101111118',
    },
  }))

  const [mutate, { data, loading, error }] = useMutation(SIGN_UP, {
    variables: {
      signUpInput: state,
    },
    onCompleted: () => {
      router.back()
      // router.back({
      //   url: '/admin/dashboard/users',
      // })
    },
  })

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    profile: z.object({
      nickname: z.string(),
      phone: z.string(),
    }),
  })

  console.log('???')

  return (
    <div className="space-y-3 flex flex-1 flex-col">
      <FormGroupControl direction="row">
        <FormControl timings={['onChange']} schema={schema}>
          <Input label="이메일" state={state} path="email" />
        </FormControl>
        <Input type="password" label="비밀번호" state={state} path="password" />
      </FormGroupControl>
      <Input label="닉네임" state={state} path="profile.nickname" />
      <Input label="휴대폰" state={state} path="profile.phone" />
      <div className="flex-row gap-4">
        <SaveButton isLoading={loading} onClickSave={mutate} />
      </div>
    </div>
  )
}
