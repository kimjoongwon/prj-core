import { type ButtonProps, type InputProps } from '@nextui-org/react';
export * from './components';

export interface BValidation {
  timings: ('onBlur' | 'onChange' | 'onFocus')[];
  type?: string | number | boolean;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  required: boolean;
  messages: Partial<Record<keyof BValidation, string>>;
  isInValid: boolean;
  errorMessage: string;
}

export interface BInput {
  type: InputProps['type'];
  label: string;
  placeholder: string;
  value: InputProps['value'];
}

export interface BComponent {
  type:
    | 'Input'
    | 'Spacer'
    | 'Button'
    | 'AppBar'
    | 'Text'
    | 'Image'
    | 'DataGrid'
    | 'BottomTab';
  props: any;
  gridProps?: object;
  validation?: BValidation;
}

export interface BLayout {
  top?: {
    component: {
      type: 'AppBar';
      props?: object;
    };
  };
  bottom?: {
    component: {
      type: 'Footer' | 'BottomTab';
      props?: object;
    };
  };
  left?: {
    component: {
      type: 'SideBar';
      props?: object;
    };
  };
  right?: {
    element: {
      type: 'SideBar';
      props: object;
    };
  };
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

export interface PageState {
  name: string;
  pathname: string;
  payload: object;
  forms?: Form[];
  layout?: BLayout;
}
