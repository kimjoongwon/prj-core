'use client'

import { SignupInput } from '@__generated__/graphql'
import { useSignUp } from '@hooks'
import { Button, ContainerProps } from '@kimjwally/ui'
import { useLocalObservable } from 'mobx-react-lite'
import { FormEvent, createContext } from 'react'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  profile: z.object({
    nickname: z.string(),
    phone: z.string(),
  }),
})

interface FormContextProps {
  schema: typeof schema
  state: SignupInput
}

export const FormContext = createContext<FormContextProps>(
  {} as FormContextProps,
)

export const FormProvider = (props: ContainerProps) => {
  const state = useLocalObservable(() => ({
    email: 'email20@gmail.com',
    password: 'rkdmf12!@',
    profile: {
      nickname: '닉네임20',
      phone: '0101111120',
    },
  }))

  const [signUp, { loading }] = useSignUp({ signUpInput: state })

  const onSubmit = () => {
    signUp()
  }

  return (
    <>
      <FormContext.Provider
        value={{
          state,
          schema,
        }}
      >
        {props.children}
      </FormContext.Provider>
      <Button isLoading={loading} onClick={onSubmit}>
        Save
      </Button>
    </>
  )
}
