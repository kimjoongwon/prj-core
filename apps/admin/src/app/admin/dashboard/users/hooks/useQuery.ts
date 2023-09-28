import { useContext } from 'react'
import { QueryContext } from '../providers/query'

export const useQuery = () => {
  const query = useContext(QueryContext)
  return query
}
