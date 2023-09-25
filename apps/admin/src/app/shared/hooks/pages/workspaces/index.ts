import { useWorkspacesPageQuery } from './query'
import { useWorkspacesPageState } from './state'
import { useWorkspacesPageTable } from './table'

export const useWorkspacesPage = () => {
  const query = useWorkspacesPageQuery()
  const state = useWorkspacesPageState()
  const table = useWorkspacesPageTable()

  return {
    query,
    state,
    table,
  }
}
