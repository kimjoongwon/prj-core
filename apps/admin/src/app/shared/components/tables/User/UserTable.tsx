'use client'

import React from 'react'
import { DataGrid, Pagination } from '@kimjwally/ui'
import { Spacer } from '@nextui-org/react'
import { useColumns } from './hooks/useColumns'
import { useLeftButtons } from './hooks/useLeftButtons'
import { GetUsersQuery, User } from '__generated__/graphql'

interface UserTableProps {
  users: GetUsersQuery['users']['nodes']
  totalCount: number
  state: any
}

export const UserTable = (props: UserTableProps) => {
  const { users, state, totalCount } = props
  const columns = useColumns()
  const leftButtons = useLeftButtons()

  return (
    <div className="w-8/12">
      <DataGrid leftButtons={leftButtons} data={users} columns={columns} />
      <Spacer y={4} />
      <Pagination state={state} totalCount={totalCount} path="skip" />
    </div>
  )
}
