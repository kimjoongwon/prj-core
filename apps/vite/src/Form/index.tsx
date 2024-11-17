import { HTMLAttributes } from 'react';
import { FormView } from './FormView';

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  state: unknown;
}

export const Form = (props: FormProps) => {
  return <FormView {...props} />;
};
