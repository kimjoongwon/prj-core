import { WorkspacesPageStateContext } from '@contexts'
import { useContext } from 'react'

export const useWorkspacesPageState = () => {
  const state = useContext(WorkspacesPageStateContext)
  return state
}
