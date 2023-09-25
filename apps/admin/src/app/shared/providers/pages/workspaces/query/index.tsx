'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { ContainerProps } from '@kimjwally/ui'
import { useWorkspacesPageState } from '@hooks'
import { WorkspacesPageQueryContext } from '@contexts'
import { observer } from 'mobx-react-lite'
import { GET_WORKSPACES } from '@gqls'

export const WorkspacesPageQueryProvider = observer((props: ContainerProps) => {
  const state = useWorkspacesPageState()
  const query = useSuspenseQuery(GET_WORKSPACES, {
    variables: {
      take: state?.table.take,
      skip: state?.table.skip,
    },
    fetchPolicy: 'cache-and-network',
  })

  return (
    <WorkspacesPageQueryContext.Provider value={{ data: query.data }}>
      {props.children}
    </WorkspacesPageQueryContext.Provider>
  )
})
