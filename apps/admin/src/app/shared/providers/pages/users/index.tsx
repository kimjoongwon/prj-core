'use client'

import { ContainerProps } from '@kimjwally/ui'
import { UsersPageStateProvider } from './state'
import { UsersPageQueryProvider } from './query'
import { UsersPageTableProvider } from './table'

export const UsersPageProviders = (props: ContainerProps) => {
  return (
    <UsersPageStateProvider>
      <UsersPageQueryProvider>
        <UsersPageTableProvider>{props.children}</UsersPageTableProvider>
      </UsersPageQueryProvider>
    </UsersPageStateProvider>
  )
}
