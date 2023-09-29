'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { ContainerProps } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { createContext } from 'react'
import { GetUsersQuery } from '__generated__/graphql'
import { useState } from '../../hooks/useState'
import { gql } from '__generated__/gql'

type Query = { data: GetUsersQuery }

export const QueryContext = createContext<Query>({} as Query)

const GET_USERS = gql(`
  query GetUsers($skip: Int, $take: Int, $sortingKey: String, $sortingValue: String) {
    users(skip: $skip, take: $take, sortingKey: $sortingKey, sortingValue: $sortingValue) {
      nodes {
        id
        email
        profile {
          id
          nickname
          phone
        }
      }
      ...PageInfo @nonreactive
    }
  }
`)

export const QueryProvider = observer((props: ContainerProps) => {
  const state = useState()
  const query = useSuspenseQuery(GET_USERS, {
    variables: {
      sortingKey: state.sortingKey,
      sortingValue: state.sortingValue,
      take: state?.table.take,
      skip: state?.table.skip,
    },
    fetchPolicy: 'cache-and-network',
  })

  return (
    <QueryContext.Provider value={{ data: query.data }}>
      {props.children}
    </QueryContext.Provider>
  )
})
