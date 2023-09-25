'use client'

import React from 'react'
import { Pagination } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { useWorkspacesPage } from '@hooks'

export const WorkspacesPagination = observer(() => {
  const {
    state,
    query: {
      data: {
        users: { totalCount },
      },
    },
  } = useWorkspacesPage()

  return <Pagination state={state.table} path="skip" totalCount={totalCount} />
})
