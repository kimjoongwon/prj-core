import { useContext } from 'react'
import { QueryContext } from '..'

export const useQuery = () => {
  const query = useContext(QueryContext)
  return query
}
