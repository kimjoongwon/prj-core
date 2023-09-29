import { observer } from 'mobx-react-lite'
import { useState } from '@hooks'
import { ContainerProps, PaginationState, TableState } from '@kimjwally/ui'
import { createContext } from 'react'

type State = TableState

export const StateContext = createContext<State>({} as State)

export const StateProvider = observer((props: ContainerProps) => {
  const state = useState<State>({
    table: { skip: 0, take: 10 },
    sortingKey: undefined,
    sortingValue: undefined,
  })

  return (
    <StateContext.Provider value={state}>
      {props.children}
    </StateContext.Provider>
  )
})
