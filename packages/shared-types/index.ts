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

export interface Input {
  type: InputProps['type'];
  label: string;
  placeholder: string;
  validator: IValidator;
  value: InputProps['value'];
  isInvalid?: boolean;
  errorMessage?: string;
}

export interface IElement {
  type: 'Input' | 'Spacer';
  input?: Input;
  style: object;
}

export interface Layout {
  type: 'Auth' | 'Empty' | 'Main';
  gridTemplateAreas?: string[][];
  style?: object;
}
export interface FormLayout {}

export interface Form {
  name: string;
  elements: IElement[];
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

export interface State {
  name: string;
  pathname: string;
  form?: Form;
  layout: Layout;
}
