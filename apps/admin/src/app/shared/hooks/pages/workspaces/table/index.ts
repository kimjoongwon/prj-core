import { WorkspacesPageTableContext } from '@contexts'
import { useContext } from 'react'

export const useWorkspacesPageTable = () => {
  return useContext(WorkspacesPageTableContext)
}
