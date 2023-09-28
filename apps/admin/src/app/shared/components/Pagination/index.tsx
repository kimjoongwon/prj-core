'use client'

import React from 'react'
import { PaginationState, Pagination } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { useFragment } from '@apollo/experimental-nextjs-app-support/ssr'
import { gql } from '__generated__'

interface PaginationProps {
  state: PaginationState
  fromTypename: string
}

export const PAGE_INFO = gql(`
  fragment PageInfo on PaginatedUser {
    pageInfo {
      totalCount
    }
  }
`)

export const CoCPagination = observer((props: PaginationProps) => {
  const { fromTypename, state } = props
  const fragment = useFragment({
    fragment: PAGE_INFO,
    fragmentName: 'PageInfo',
    from: {
      __typename: fromTypename,
    },
  })

  console.log('fragment', fragment)
  return (
    <Pagination
      state={state}
      path="table.skip"
      totalCount={fragment.data.pageInfo?.totalCount ?? 0}
    />
  )
})
