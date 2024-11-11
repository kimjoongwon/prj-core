import { HTMLAttributes } from 'react';
import { FormView } from './FormView';
import { ButtonProps } from '@nextui-org/react';

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  name: string;
  buttonProps: ButtonProps;
}

export const Form = (props: FormProps) => {
  return <FormView {...props} />;
};
