import { type InputProps } from '@nextui-org/react';

export interface IValidator {
  validation: IValidation;
}

export interface IValidation {
  timings: ('onBlur' | 'onChange' | 'onFocus')[];
  type?: string | number | boolean;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  required: boolean;
  messages: Partial<Record<keyof IValidation, string>>;
  isValid: boolean;
}

export interface IInput {
  type: InputProps['type'];
  label: string;
  placeholder: string;
  validator: IValidator;
  value: InputProps['value'];
  isInvalid?: boolean;
  errorMessage?: string;
}

export interface IElement {
  type: 'Input' | 'Spacer' | 'Button';
  input?: Input | IButton;
  gridProps?: object;
}

export interface Layout {
  type: 'Auth' | 'Empty' | 'Main';
  gridProps?: object;
}
export interface FormLayout {}

export interface Form {
  name: string;
  elements: IElement[];
}

export interface FormButtonFlow {
  state?: object;
  path?: string;
  mutation?: string;
  success?: Success;
  failure?: Failure;
}

export interface IButton {
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
  title: string;
  fullWidth?: boolean;
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

export interface State {
  name: string;
  pathname: string;
  form?: Form;
  layout: Layout;
}
