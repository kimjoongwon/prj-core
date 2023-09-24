'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { ContainerProps } from '@kimjwally/ui'
import { useUsersPageState } from '@hooks'
import { GET_USERS } from '@queries'
import { UsersPageQueryContext } from '@contexts'
import { observer } from 'mobx-react-lite'

export const UsersPageQueryProvider = observer((props: ContainerProps) => {
  const state = useUsersPageState()
  const query = useSuspenseQuery(GET_USERS, {
    variables: {
      take: state?.table.take,
      skip: state?.table.skip,
    },
    fetchPolicy: 'cache-and-network',
  })

  return (
    <UsersPageQueryContext.Provider value={{ data: query.data }}>
      {props.children}
    </UsersPageQueryContext.Provider>
  )
})
