import { useWorkspacesColumns } from '@columns'
import { WorkspacesPageTableContext } from '@contexts'
import { useWorkspacesPageQuery } from '@hooks'
import { ContainerProps } from '@kimjwally/ui'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Workspace } from '__generated__/graphql'

export const WorkspacesPageTableProvider = (props: ContainerProps) => {
  const query = useWorkspacesPageQuery()
  const columns = useWorkspacesColumns()

  const table = useReactTable({
    data: (query?.data.workspaces.nodes ?? []) as Workspace[],
    getCoreRowModel: getCoreRowModel(),
    columns,
  })

  return (
    <WorkspacesPageTableContext.Provider value={table}>
      {props.children}
    </WorkspacesPageTableContext.Provider>
  )
}
