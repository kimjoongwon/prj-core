import { UsersPageStateContext } from '@contexts'
import { useContext } from 'react'

export const useUsersPageState = () => {
  const state = useContext(UsersPageStateContext)
  return state
}
