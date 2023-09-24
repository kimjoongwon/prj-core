import { UsersPageTableContext } from '@contexts'
import { useContext } from 'react'

export const useUsersPageTable = () => {
  return useContext(UsersPageTableContext)
}
