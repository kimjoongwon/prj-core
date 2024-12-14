import { type InputProps, type ButtonProps } from '@nextui-org/react';
import { Key } from 'react';

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
  type: string;
  props: any;
  path?: string;
  gridProps?: object;
  validation?: ValidationBuilder;
}

export interface FormBuilder {
  name?: string;
  isInValid?: boolean;
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
  type?: 'Outlet' | 'Form' | 'Table';
  name?: string;
  form?: FormBuilder;
  table?: TableBuilder;
}

export interface TableBuilder {
  apiKey: string;
  query: object;
  meta?: {
    expandable?: boolean;
  };
  selection?: Key[] | 'all';
  columns: any[];
  remove?: {
    mutationKey: string;
    try: Try;
    catch: Catch;
    finally: Finally;
  };
  delete?: {
    mutationKey: string;
    try: Try;
    catch: Catch;
    finally: Finally;
  };
  update?: {
    mutationKey: string;
    try: Try;
    catch: Catch;
    finally: Finally;
  };
  create?: {
    try: Try;
    catch: Catch;
    finally: Finally;
  };
}

export interface SectionBuilder {
  name: string;
  payload: object;
  gridProps?: object;
  components: ComponentBuilder[];
}
