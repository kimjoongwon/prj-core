import { PaginationState } from '@kimjwally/ui'
import { Table } from '@tanstack/react-table'
import { GetUsersQuery, User } from '__generated__/graphql'
import { createContext } from 'react'

type Query = { data: GetUsersQuery }
type State = PaginationState
type TableContext = Table<User>

export const UsersPageQueryContext = createContext<Query>({} as Query)

export const UsersPageStateContext = createContext<State>({} as State)

export const UsersPageTableContext = createContext<TableContext>(
  {} as TableContext,
)
