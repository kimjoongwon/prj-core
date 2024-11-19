import { type ButtonProps, type InputProps } from '@nextui-org/react';

export interface BValidation {
  timings: ('onBlur' | 'onChange' | 'onFocus')[];
  type?: string | number | boolean;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  required: boolean;
  messages: Partial<Record<keyof BValidation, string>>;
  isValid: boolean;
}

export interface BInput {
  type: InputProps['type'];
  label: string;
  placeholder: string;
  value: InputProps['value'];
}

export interface BCommonComponent {
  validation: BValidation;
  isInvalid?: boolean;
  errorMessage?: string;
}

export interface BComponent {
  validation?: BValidation;
  type: 'Input' | 'Spacer' | 'Button';
  props: any;
  gridProps?: object;
}

export interface Layout {
  type: 'Auth' | 'Empty' | 'Main';
  gridProps?: object;
}
export interface FormLayout {}

export interface Form {
  name: string;
  components: BComponent[];
}

export interface FormButtonFlow {
  state?: object;
  path?: string;
  mutation?: string;
  success?: Success;
  failure?: Failure;
}

export interface BButton extends ButtonProps {}

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
