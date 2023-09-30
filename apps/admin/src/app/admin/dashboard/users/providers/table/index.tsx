import { createContext } from 'react'
import { useUsersColumns } from '@columns'
import { ContainerProps, GroupButton } from '@kimjwally/ui'
import { useCoCTable } from '@hooks'
import { Header, Row } from '@tanstack/react-table'
import { useQuery } from '../query/hooks/useQuery'
import { useButtons } from './hooks/useButtons'
import { User } from '@__generated__/graphql'

interface TableContext {
  rows: Row<User>[]
  headers: Header<User, any>[]
  leftButtons: GroupButton[]
  rightButtons: GroupButton[]
}

export const TableContext = createContext<TableContext>({} as TableContext)

export const TableProvider = (props: ContainerProps) => {
  const query = useQuery()
  const columns = useUsersColumns()
  const { leftButtons, rightButtons } = useButtons()

  const table = useCoCTable<User>({
    data: query.data?.users?.nodes || [],
    columns: columns,
  })

  return (
    <TableContext.Provider
      value={{
        headers: table.getHeaderGroups()?.[0].headers || [],
        rows: table.getRowModel().rows,
        leftButtons,
        rightButtons,
      }}
    >
      {props.children}
    </TableContext.Provider>
  )
}
