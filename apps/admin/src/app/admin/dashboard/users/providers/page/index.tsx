'use client'

import { ContainerProps } from '@kimjwally/ui'
import { StateProvider } from '../state'
import { QueryProvider } from '../query'
import { TableProvider } from '../table'

export const PageProvider = (props: ContainerProps) => {
  return (
    <StateProvider>
      <QueryProvider>
        <TableProvider>{props.children}</TableProvider>
      </QueryProvider>
    </StateProvider>
  )
}
