import React from 'react'
import { DataGrid } from '@kimjwally/ui'
import { useColumns } from './hooks/useColumns'
import { useDashboardUsersPage } from 'app/admin/dashboard/users/provider'

export const UserTable = () => {
  const { data } = useDashboardUsersPage()
  const columns = useColumns()
  return <DataGrid data={data.users.nodes} columns={columns} />
}
