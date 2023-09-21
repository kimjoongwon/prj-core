'use client'

import React, { useState } from 'react'
import { DataGrid, DataGridButton, Pagination } from '@kimjwally/ui'
import { createColumnHelper } from '@tanstack/react-table'
import { gql } from '__generated__/gql'
import { User } from '__generated__/graphql'
import { USER_EDIT_PATH, useCoCRouter } from 'app/shared/hooks/useCoCRouter'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { observer, useLocalObservable } from 'mobx-react-lite'

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

export const UserTable = observer(() => {
  const router = useCoCRouter()
  const state = useLocalObservable(() => ({
    skip: 0,
    take: 10,
  }))

  const { data } = useSuspenseQuery(GET_USERS, {
    variables: { take: state.take, skip: state.skip },
    fetchPolicy: 'cache-and-network',
  })

  console.log({ ...state })

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
      onClick: () => {
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
      <Pagination state={state} total={10} path="skip" />
    </>
  )
})
