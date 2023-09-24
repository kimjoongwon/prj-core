import { useContext } from 'react'
import { UsersPageQueryContext } from '@contexts'

export const useUsersPageQuery = () => {
  const query = useContext(UsersPageQueryContext)
  return query
}
