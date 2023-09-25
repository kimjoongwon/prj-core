import { WorkspacesPageStateContext } from '@contexts'
import { ContainerProps } from '@kimjwally/ui'
import { observer } from 'mobx-react-lite'
import { useState } from '@hooks'

export const WorkspacesPageStateProvider = observer((props: ContainerProps) => {
  const state = useState({ table: { skip: 0, take: 10 } })

  return (
    <WorkspacesPageStateContext.Provider value={state}>
      {props.children}
    </WorkspacesPageStateContext.Provider>
  )
})
