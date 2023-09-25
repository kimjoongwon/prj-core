import { createColumnHelper } from '@tanstack/react-table'
import { Workspace } from '__generated__/graphql'

export const useWorkspacesColumns = () => {
  const columnHelper = createColumnHelper<Workspace>()

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
  ]
  return columns
}
