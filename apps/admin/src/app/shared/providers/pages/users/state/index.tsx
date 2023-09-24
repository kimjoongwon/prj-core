import { UsersPageStateContext } from '@contexts'
import { ContainerProps } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { useState } from '@hooks'

export const UsersPageStateProvider = observer((props: ContainerProps) => {
  const state = useState({ table: { skip: 0, take: 10 } })

  return (
    <UsersPageStateContext.Provider value={state}>
      {props.children}
    </UsersPageStateContext.Provider>
  )
})
