import { PaginationState } from '@kimjwally/ui'
import { Table } from '@tanstack/react-table'
import { PaginatedWorkspace, Workspace } from '__generated__/graphql'
import { createContext } from 'react'

type Query = { data: PaginatedWorkspace }
type State = PaginationState
type TableContext = Table<Workspace>

export const WorkspacesPageQueryContext = createContext<Query>({} as Query)

export const WorkspacesPageStateContext = createContext<State>({} as State)

export const WorkspacesPageTableContext = createContext<TableContext>(
  {} as TableContext,
)
