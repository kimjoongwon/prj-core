'use client'

import { FormControl, FormGroupControl, Input } from '@kimjwally/ui'
import { EditLayout } from '../../layouts/Edit'
import { useLocalObservable } from 'mobx-react-lite'
import { SignupInput } from '__generated__/graphql'
import { z } from 'zod'

export const UserForm = () => {
  const state: SignupInput = useLocalObservable(() => ({
    email: 'email1@gmail.com',
    password: 'rkdmf12!@',
    profile: {
      nickname: '닉네임1',
      phone: '01011111111',
    },
  }))

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    profile: z.object({
      nickname: z.string(),
      phone: z.string(),
    }),
  })

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
    </div>
  )
}
