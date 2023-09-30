import { observer } from 'mobx-react-lite'
import { FormProvider } from '../form'
import { ContainerProps } from '@kimjwally/ui'

export const PageProvider = observer((props: ContainerProps) => {
  const { children } = props

  return <FormProvider>{children}</FormProvider>
})
