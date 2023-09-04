'use client'

import React from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { DataGrid } from '@kimjwally/ui'
import { gql } from '__generated__/gql'
import { createColumnHelper } from '@tanstack/react-table'
import { User } from '__generated__/graphql'

export const GET_USERS = gql(`#graphql
  query GetUsers($email: String!) {
    users(email: $email) {
      totalCount
      nodes {
        email
        id
      }
      edges {
        cursor
      }
    }
  }
`)

export const Users = () => {
  const {
    data: {
      users: { totalCount, edges, nodes },
    },
  } = useSuspenseQuery(GET_USERS, {
    variables: { email: '' },
  })

  const columnHelper = createColumnHelper<User>()
  console.log('nodes', nodes)
  const columns = [
    columnHelper.accessor('email', {
      id: '이메일',
      header: '이메일',
    }),
    columnHelper.accessor('id', {
      id: '아이디',
      header: '아이디',
    }),
  ]

  return <DataGrid data={nodes || []} columns={columns} />
}
