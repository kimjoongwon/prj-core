import { useContext } from 'react'
import { WorkspacesPageQueryContext } from '@contexts'

export const useWorkspacesPageQuery = () => {
  const query = useContext(WorkspacesPageQueryContext)
  return query
}
