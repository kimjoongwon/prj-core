'use client'

import React from 'react'
import { Pagination } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { useUsersPage } from '@hooks'

export const UsersPagination = observer(() => {
  const {
    state,
    query: {
      data: {
        users: { totalCount },
      },
    },
  } = useUsersPage()

  return <Pagination state={state.table} path="skip" totalCount={totalCount} />
})
