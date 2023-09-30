import { useContext } from 'react'
import { TableContext } from '..'

export const useTable = () => {
  return useContext(TableContext)
}
