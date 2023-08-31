'use client'

import React from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { DataGrid } from '@kimjwally/ui'
import { gql } from '__generated__/gql'
import { ColumnDef, RowData, createColumnHelper } from '@tanstack/react-table'
import { User } from '__generated__/graphql'
import { useColumns } from 'app/shared/hooks/useColumns'

export const GET_USERS = gql(`#graphql
  query Users {
    users {
      id
      email
      profile {
        phone
      }
    }
  }
`)

export const Users = () => {
  const {
    data: { users },
  } = useSuspenseQuery(GET_USERS)

  const columnHelper = createColumnHelper<User>()

  const columns = [
    columnHelper.accessor('email', {}),
    columnHelper.accessor('profile.phone', {}),
  ]

  return <DataGrid data={users} columns={columns} />
}
