'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useState } from '@hooks'
import { gql } from '__generated__'
import { UserTable } from 'app/shared/components/tables/User/UserTable'
import { observer } from 'mobx-react-lite'
/**
 * 데이터 페칭을 어디서 할지 생각해야 됩니다!!
 */
export const GET_USERS = gql(`#graphql
  query GetUsers ($skip: Int, $take: Int) {
    users(skip: $skip, take: $take ) {
      nodes {
        email
        profile {
          nickname
          phone
        }
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`)

function Page() {
  const state = useState({
    skip: 0,
    take: 10,
  })

  const { data } = useSuspenseQuery(GET_USERS, {
    variables: { take: state.take, skip: state.skip },
    fetchPolicy: 'cache-and-network',
  })

  return (
    <UserTable
      users={data.users.nodes || []}
      state={state}
      totalCount={data.users.totalCount}
    />
  )
}

export default observer(Page)
