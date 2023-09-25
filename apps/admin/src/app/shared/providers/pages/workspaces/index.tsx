'use client'

import { ContainerProps } from '@kimjwally/ui'
import { WorkspacesPageStateProvider } from './state'
import { WorkspacesPageQueryProvider } from './query'
import { WorkspacesPageTableProvider } from './table'

export const WorkspacesPageProviders = (props: ContainerProps) => {
  return (
    <WorkspacesPageStateProvider>
      <WorkspacesPageQueryProvider>
        <WorkspacesPageTableProvider>
          {props.children}
        </WorkspacesPageTableProvider>
      </WorkspacesPageQueryProvider>
    </WorkspacesPageStateProvider>
  )
}
