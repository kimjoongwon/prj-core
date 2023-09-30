import { ContainerProps } from '@kimjwally/ui'

interface FormContainerProps extends ContainerProps {}

export const FormContainer = (props: FormContainerProps) => {
  const { children } = props

  return <div>{children}</div>
}
