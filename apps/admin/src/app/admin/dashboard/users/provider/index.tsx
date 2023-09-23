'use client'

import { useSuspenseQuery } from '@apollo/client'
import { ContainerProps } from '@kimjwally/ui'
import { gql } from '__generated__'
import { GetUsersQuery } from '__generated__/graphql'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { createContext, useContext } from 'react'

export const GET_USERS = gql(`#graphql
  query GetUsers ($skip: Int, $take: Int) {
    users(skip: $skip, take: $take ) {
      nodes {
        email
        profile {
          nickname
          phone
        }
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`)

const state = observable({ table: { skip: 0, take: 10 } })

const Context = createContext<
  | {
      state: typeof state
      data: GetUsersQuery
    }
  | undefined
>(undefined)

export const Provider = observer((props: ContainerProps) => {
  const query = useSuspenseQuery(GET_USERS, {
    variables: {
      take: state.table.take,
      skip: state.table.skip,
    },
    fetchPolicy: 'cache-and-network',
  })

  console.log('query.data', query.data)
  return (
    <Context.Provider value={{ state, data: query?.data }}>
      {props.children}
    </Context.Provider>
  )
})

export const useDashboardUsersPage = () => {
  const context = useContext(Context)!
  return context
}
