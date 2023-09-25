'use client'

import React from 'react'
import { DataGrid } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { useWorkspacesPage } from '@hooks'

export const WorkspacesDataGrid = observer(() => {
  const {
    query: { data },
    table,
  } = useWorkspacesPage()

  return <DataGrid table={table} data={data.workspaces.nodes} />
})
