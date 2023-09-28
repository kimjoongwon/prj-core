import { observer } from 'mobx-react-lite'
import { useState } from '@hooks'
import { ContainerProps, PaginationState } from '@kimjwally/ui'
import { createContext } from 'react'

type State = PaginationState

export const StateContext = createContext<State>({} as State)

export const StateProvider = observer((props: ContainerProps) => {
  const state = useState({ table: { skip: 0, take: 10 } })

  return (
    <StateContext.Provider value={state}>
      {props.children}
    </StateContext.Provider>
  )
})
