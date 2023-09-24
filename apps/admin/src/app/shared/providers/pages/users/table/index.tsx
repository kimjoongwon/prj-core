import { useUsersColumns } from '@columns'
import { UsersPageTableContext } from '@contexts'
import { useUsersPageQuery } from '@hooks'
import { ContainerProps } from '@kimjwally/ui'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { User } from '__generated__/graphql'

export const UsersPageTableProvider = (props: ContainerProps) => {
  const query = useUsersPageQuery()
  const columns = useUsersColumns()

  const table = useReactTable({
    data: (query?.data.users.nodes ?? []) as User[],
    getCoreRowModel: getCoreRowModel(),
    columns,
  })

  return (
    <UsersPageTableContext.Provider value={table}>
      {props.children}
    </UsersPageTableContext.Provider>
  )
}
