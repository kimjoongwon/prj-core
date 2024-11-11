import { HTMLAttributes } from 'react';
import { FormView } from './FormView';
import { IPage } from '@shared/types';

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  form: IPage['form'];
}

export const Form = (props: FormProps) => {
  return <FormView {...props} />;
};
