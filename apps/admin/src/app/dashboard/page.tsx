'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { gql } from '__generated__'
import dayjs from 'dayjs'
import React from 'react'

const GET_USERS = gql(`
    query Users {
      users {
        id
        email
        profile {
          nickname
          phone
        }
      }
    }
  `)

export default function Page() {
  const { data } = useSuspenseQuery(GET_USERS)

  return (
    <div>
      <div>-----!!----</div>
      {/* <div>rendering은 됩니다.</div> */}
      {data?.users?.map((user) => (
        <div key={user.id}>{dayjs(user.profile.nickname).valueOf()}</div>
      ))}
    </div>
  )
}
