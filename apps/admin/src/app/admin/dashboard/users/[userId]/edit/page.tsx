import { useMutation } from '@apollo/client'
import { UserForm } from '@components'
import { gql } from '__generated__'

export const CREATE_USER = gql(`#graphql
  mutation CreateUser($signUpInput: SignupInput!) {
    signup(data: $signUpInput) {
      user {
        id
      }
    }
  }
`)

export default function Page({ userId }: { userId: string }) {
  const isNew = userId === 'new'

  return (
    <div className="w-unit-9xl">
      <UserForm />
    </div>
  )
}
