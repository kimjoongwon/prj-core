'use client'

import { gql } from '__generated__/gql'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useLocalObservable } from 'mobx-react-lite'

export const dynamic = 'force-dynamic'

const GET_USERS = gql(/* GraphQL */ `
  query Users {
    users {
      email
      createdAt
      profile {
        phone
      }
    }
  }
`)

export default function Page() {
  const { data } = useSuspenseQuery(GET_USERS)
  const user = useLocalObservable(() => ({ name: 'asasd' }))
  const onClick = () => {
    user.name = 'asdasd'
  }

  return (
    <div>
      {data?.users?.map((user) => (
        <div key={user.createdAt}>{user.email}</div>
      ))}
    </div>
  )
}
