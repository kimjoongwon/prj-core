import { type ButtonProps, type InputProps } from '@nextui-org/react';
export * from './components';

export interface ValidationBuilder {
  timings: ('onBlur' | 'onChange' | 'onFocus')[];
  type?: string | number | boolean;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  required: boolean;
  messages: Partial<Record<keyof ValidationBuilder, string>>;
  isInvalid: boolean;
  errorMessage: string;
}

export interface InputBuilder {
  type: InputProps['type'];
  label: string;
  placeholder: string;
  value: InputProps['value'];
}

export interface ComponentBuilder {
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
  path: string;
  gridProps?: object;
  validation?: ValidationBuilder;
}

export interface FormBuilder {
  name: string;
  isInValid: boolean;
  sections: SectionBuilder[];
  button: ButtonBuilder;
}

export interface FormButtonFlow {
  state?: object;
  path?: string;
  mutation?: string;
  try?: Try;
  catch?: Catch;
  finally: Finally;
}

export interface ButtonBuilder extends ButtonProps {
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

export interface AppBuilder {
  name: string;
  routes: RouteBuilder[];
}

export interface LayoutBuilder {
  type?:
    | 'Outlet'
    | 'Auth'
    | 'Main'
    | 'Root'
    | 'Sidebar'
    | 'Admin'
    | 'Services'
    | 'Service'
    | 'Table'
    | 'Form';
  page?: PageBuilder;
}

export interface RouteBuilder {
  name: string;
  pathname: string;
  active: boolean;
  layout?: LayoutBuilder;
  children?: RouteBuilder[];
}

export interface PageBuilder {
  type?: 'Outlet';
  name?: string;
  form?: FormBuilder;
}

export interface SectionBuilder {
  name: string;
  payload: object;
  gridProps?: object;
  components: ComponentBuilder[];
}

export interface Route {
  name: string;
  pathname: string;
  active?: boolean;
  icon?: string;
  visible?: boolean;
  onClick?: () => void;
  children?: Route[];
}
