import { useContext } from 'react'
import { TableContext } from '../providers/table'
import { GroupButton } from '@kimjwally/ui'
import { useCoCRouter } from '@hooks'

export const useTable = () => {
  return useContext(TableContext)
}
