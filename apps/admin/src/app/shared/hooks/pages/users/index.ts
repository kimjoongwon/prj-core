import { useUsersPageQuery } from './query'
import { useUsersPageState } from './state'
import { useUsersPageTable } from './table'

export const useUsersPage = () => {
  const query = useUsersPageQuery()
  const state = useUsersPageState()
  const table = useUsersPageTable()

  return {
    query,
    state,
    table,
  }
}
