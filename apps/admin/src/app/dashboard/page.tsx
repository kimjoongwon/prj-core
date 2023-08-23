'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
// import { useSuspenseQuery } from '@apollo/client'
// import { useSuspenseQuery } from '@apollo/client'
// import { useSuspenseQuery } from '@apollo/client/react/hooks/useSuspenseQuery'
// import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/dist/ssr/hooks'
// import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { gql } from '__generated__'

const GET_USERS = gql(`
    query Users {
      users {
        id
        email
        # profile {
        #   nickname
        #   phone
        # }
      }
    }
  `)

export default function Page() {
  const { data } = useSuspenseQuery(GET_USERS, { errorPolicy: 'all' })

  return (
    <div>
      {data?.users?.map((user) => <div key={user.id}>{user.email}</div>)}
    </div>
  )
}
