import { useQuery } from './useQuery'
import { useState } from './useState'
import { useTable } from './useTable'

export const usePage = () => {
  return {
    state: useState(),
    query: useQuery(),
    table: useTable(),
  }
}
