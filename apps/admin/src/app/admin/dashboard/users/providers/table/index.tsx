import { useUsersColumns } from '@columns'
import { ContainerProps, GroupButton } from '@kimjwally/ui'
import { Header, Row } from '@tanstack/react-table'
import { User } from '__generated__/graphql'
import { useQuery } from '../../hooks/useQuery'
import { createContext } from 'react'
import { useCoCRouter, useCoCTable } from '@hooks'

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
  const { getUrlWithParams } = useCoCRouter()

  const table = useCoCTable<User>({
    data: query.data?.users?.nodes || [],
    columns: columns,
  })

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
  ]

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
  ]

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
