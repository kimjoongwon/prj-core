'use client'

import React from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { DataGrid } from '@kimjwally/ui'
import { createColumnHelper } from '@tanstack/react-table'
import { gql } from '__generated__/gql'
import { User } from '__generated__/graphql'
import { DataGridButton } from '@kimjwally/ui'
import { state } from '../../modals/test/TestModal'

export const GET_USERS = gql(`#graphql
  query GetUsers($email: String!) {
    users(email: $email) {
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
  const {
    data: { users },
  } = useSuspenseQuery(GET_USERS, {
    variables: { email: '' },
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

  // console.log('users.edges', users)

  const leftButtons: DataGridButton<Partial<User>>[] = [
    {
      text: '생성',
      onClick: () => {
        console.log('state', state)
        state.open = !state.open
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
