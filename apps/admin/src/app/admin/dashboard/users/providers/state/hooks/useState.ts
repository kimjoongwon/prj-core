import { useContext } from 'react'
import { StateContext } from '..'

export const useState = () => {
  const state = useContext(StateContext)
  return state
}
