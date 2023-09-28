'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { ContainerProps } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { GET_USERS } from '@gqls'
import { createContext } from 'react'
import { GetUsersQuery } from '__generated__/graphql'
import { useState } from '../../hooks/useState'

type Query = { data: GetUsersQuery }
export const QueryContext = createContext<Query>({} as Query)

export const QueryProvider = observer((props: ContainerProps) => {
  const state = useState()
  const query = useSuspenseQuery(GET_USERS, {
    variables: {
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
