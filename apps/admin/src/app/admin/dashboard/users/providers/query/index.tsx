'use client'

import { ContainerProps } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { createContext } from 'react'
import { useState } from '../state/hooks/useState'
import { useUsersQuery } from '@hooks'
import { GetUsersQuery } from '@__generated__/graphql'

type Query = { data: GetUsersQuery }

export const QueryContext = createContext<Query>({} as Query)

interface QueryProviderProps extends ContainerProps {}

export const QueryProvider = observer((props: QueryProviderProps) => {
  const state = useState()

  const query = useUsersQuery({
    skip: state.table.skip,
    take: state.table.take,
    sortingKey: state.sortingKey,
    sortingValue: state.sortingValue,
  })

  return (
    <QueryContext.Provider value={{ data: query.data }}>
      {props.children}
    </QueryContext.Provider>
  )
})
