import { EditLayout } from '@components'
import { FormProvider } from './providers/form'
import { ContainerProps } from '@kimjwally/ui'

export interface UserEditPageProps extends ContainerProps {
  params: { userId: string | 'new' }
}

export default function Layout(props: UserEditPageProps) {
  return (
    <EditLayout>
      <FormProvider>{props.children}</FormProvider>
    </EditLayout>
  )
}
