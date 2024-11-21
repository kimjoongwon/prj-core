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
}
export interface FormLayout {}

export interface Form {
  name: string;
  gridProps?: object;
  components: BComponent[];
}

export interface FormButtonFlow {
  state?: object;
  path?: string;
  mutation?: string;
  try?: Try;
  catch?: Catch;
  finally: Finally;
}

export interface BButton extends ButtonProps {
  flow: {
    try: Try;
    catch: Catch;
    finally: Finally;
    mutation: string;
  };
}

interface Catch {
  severity: 'success' | 'error';
  message: string;
  pathname?: string;
}
interface Finally {
  message: string;
  pathname?: string;
}

interface Try {
  message: string;
  pathname?: string;
  severity: 'success' | 'error';
}

export interface State {
  name: string;
  pathname: string;
  payload: object;
  forms?: Form[];
  layout: Layout;
}
