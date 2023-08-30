'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { gql } from '__generated__'

const GET_USERS = gql(`
    query Users {
      users {
        id
        email
      }
    }
  `)

export default function Page() {
  return <div>유저상세</div>
}
