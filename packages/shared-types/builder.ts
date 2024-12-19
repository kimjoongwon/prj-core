import { type InputProps } from '@nextui-org/react';
import { Key } from 'react';
import { HeaderContext, CellContext, ColumnDef } from '@tanstack/react-table';

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
  defaultValues?: object;
  sections: SectionBuilder[];
  button: ButtonBuilder;
}

export interface ButtonBuilder {
  type?: 'ROW';
  name: string;
  mutation?: Mutation;
  success?: SuccessOrFailure;
  failure?: SuccessOrFailure;
}
export interface SuccessOrFailure {
  link: string;
  message?: string;
  keysForConvertPayloadsToParams?: string[];
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
  params?: object;
  children?: RouteBuilder[];
}

export interface PageBuilder {
  type?: 'Outlet' | 'Form' | 'Table';
  apiKey?: string;
  query?: object;
  name?: string;
  form?: FormBuilder;
  table?: TableBuilder;
}

export interface TableBuilder {
  apiKey: string;
  query: object;
  meta?: any;
  selection?: Key[] | 'all';
  columns: ColumnBuilder[];
}

export interface ColumnBuilder {
  id?: string;
  accessorKey?: string;
  header: Header;
  cell?: Cell;
}
export interface Cell {
  buttons?: ButtonBuilder[];
  expandable?: boolean;
}
export interface Header {
  name: string;
  expandable?: boolean;
}

export interface HeaderBuilderProps
  extends HeaderContext<unknown & { id: string }, unknown>,
    Header {}
export interface CellBuilderProps
  extends CellContext<unknown & { id: string }, unknown>,
    Cell {}

export interface SectionBuilder {
  name: string;
  gridProps?: object;
  components: ComponentBuilder[];
}

export interface Mutation {
  key: string;
  keyForConvertParamsToPayloads?: string[];
}
