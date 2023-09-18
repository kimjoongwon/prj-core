'use client'

import React, { useState } from 'react'
import { DataGrid } from '@kimjwally/ui'
import { createColumnHelper } from '@tanstack/react-table'
import { gql } from '__generated__/gql'
import { User } from '__generated__/graphql'
import { DataGridButton } from '@kimjwally/ui'
import { USER_EDIT_PATH, useCoCRouter } from 'app/shared/hooks/useCoCRouter'
import { Pagination } from '@nextui-org/react'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'

export const GET_USERS = gql(`#graphql
  query GetUsers ($skip: Int, $take: Int) {
    users(skip: $skip, take: $take ) {
      edges {
        node {
          id
          email
        }
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`)

export const UserTable = () => {
  const router = useCoCRouter()
  const [skip, setSkip] = useState(0)
  const take = 10
  const { data, fetchMore } = useSuspenseQuery(GET_USERS, {
    variables: { take, skip },
    fetchPolicy: 'cache-and-network',
  })
  const users = data?.users
  const columnHelper = createColumnHelper<User>()

  const columns = [
    columnHelper.accessor('id', {
      header: '이메일',
    }),
    columnHelper.accessor('email', {
      id: 'test',
      header: '아이디',
    }),
  ]

  const leftButtons: DataGridButton<Partial<User>>[] = [
    {
      text: '생성',
      onClick: (table) => {
        router.push({
          url: USER_EDIT_PATH,
          params: {
            userId: 'new',
          },
        })
      },
      props: { variant: 'solid', color: 'primary' },
    },
  ]
  return (
    <>
      <DataGrid
        leftButtons={leftButtons}
        data={users?.edges?.map((edge) => edge.node) || []}
        columns={columns}
      />
      <Pagination
        total={10}
        onChange={(page) => {
          setSkip((page - 1) * take)
        }}
      />
    </>
  )
}
