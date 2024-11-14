import { type InputProps } from '@nextui-org/react';
export interface Validation {
  timing: 'onBlur' | 'onChange' | 'onClick';
  required: boolean;
  message: string;
}

export interface Input {
  type: InputProps['type'];
  label: string;
  path: string;
  placeholder: string;
  validation?: Validation;
}

export interface Element {
  type: 'Input';
  input: Input;
}
export interface Layout {
  type: 'Auth' | 'Empty' | 'Main';
}

export interface Form {
  name: string;
  elements: Element[];
  button: FormButton;
}

export interface FormButtonFlow {
  state?: object;
  path?: string;
  mutation?: string;
  success?: Success;
  failure?: Failure;
}

export interface FormButton {
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
  title: string;
  flow?: FormButtonFlow;
}

interface Failure {
  message: string;
  pathname?: string;
}

interface Success {
  message: string;
  pathname?: string;
}

export interface IPage {
  name: string;
  pathname: string;
  form?: Form;
  state: object;
  layout: Layout;
}
