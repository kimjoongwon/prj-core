'use client'

import React from 'react'
import { DataGrid } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { useUsersPage } from '@hooks'

export const UsersDataGrid = observer(() => {
  const {
    query: { data },
    table,
  } = useUsersPage()

  return <DataGrid table={table} data={data.users.nodes} />
})
