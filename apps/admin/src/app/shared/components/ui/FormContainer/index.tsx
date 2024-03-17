import { ContainerProps } from '@coc/web';

interface FormContainerProps extends ContainerProps {}

export const FormContainer = (props: FormContainerProps) => {
  const { children } = props;

  return <div className="flex-0 basis-[520px]">{children}</div>;
};
