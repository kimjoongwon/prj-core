import { useContext } from 'react'
import { StateContext } from '../providers/state'

export const useState = () => {
  const state = useContext(StateContext)
  return state
}
