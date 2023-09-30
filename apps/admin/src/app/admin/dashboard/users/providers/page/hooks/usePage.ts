import { useQuery } from '../../query/hooks/useQuery'
import { useState } from '../../state/hooks/useState'
import { useTable } from '../../table/hooks/useTable'

export const usePage = () => {
  return {
    state: useState(),
    query: useQuery(),
    table: useTable(),
  }
}
