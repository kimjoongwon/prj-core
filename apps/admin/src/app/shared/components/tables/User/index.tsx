'use client'

import React from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { DataGrid } from '@kimjwally/ui'
import { createColumnHelper } from '@tanstack/react-table'
import { gql } from '__generated__/gql'
import { User } from '__generated__/graphql'
import { DataGridButton } from '@kimjwally/ui'
import { state } from '../../modals/Test'
import { USER_EDIT_PATH, useCoCRouter } from 'app/shared/hooks/useCoCRouter'

export const GET_USERS = gql(`#graphql
  query GetUsers($email: String!, $cursor: String!, $skip: Int, $take: Int  ) {
    users(cursor: $cursor, email: $email , skip: $skip , take: $take ) {
      totalCount
      edges {
        node {
          email
          id
        }
      }
      nodes {
        id
      }
    }
  }
`)

export const UserTable = () => {
  const router = useCoCRouter()

  const {
    data: { users },
  } = useSuspenseQuery(GET_USERS, {
    variables: { email: '', take: 10 },
  })

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
    <DataGrid
      leftButtons={leftButtons}
      data={users.edges?.map((edge) => edge.node) || []}
      columns={columns}
    />
  )
}
