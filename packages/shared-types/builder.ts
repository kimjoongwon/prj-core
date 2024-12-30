import { type InputProps } from '@nextui-org/react';
import { Key } from 'react';
import { HeaderContext, CellContext } from '@tanstack/react-table';

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
  state?: object & { payload: any & { serviceId?: string } };
  isInValid?: boolean;
  sections: SectionBuilder[];
  button?: ButtonBuilder;
}

export interface ButtonBuilder {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  name: string;
  mutation?: Mutation;
  navigator?: Navigator;
  alert?: Alert;
}

export interface Alert {
  message: string;
}

export interface Navigator {
  pathname: string;
  hasResourceId?: boolean;
  hasParentId?: boolean;
  hasParams?: boolean;
  params?: object & { resourceId?: string; parentId?: string };
}

export interface SuccessOrFailure {
  link: string;
  message?: string;
  params?: object & { resourceId: string };
}

export interface AppBuilder {
  name: string;
  routes: RouteBuilder[];
}

export interface LayoutBuilder {
  name?: string;
  type?:
    | 'Outlet'
    | 'Auth'
    | 'Main'
    | 'Root'
    | 'Admin'
    | 'Form'
    | 'Services'
    | 'Service'
    | 'Master'
    | 'Detail';
  page?: PageBuilder;
}

export interface RouteBuilder {
  name: string;
  pathname: string;
  layout?: LayoutBuilder;
  params?: object;
  children?: RouteBuilder[];
}

export interface Query {
  name: string;
  hasResourceId?: boolean;
  hasParams?: boolean;
  hasServiceId?: boolean;
  params?: any & { serviceId?: string };
}

export interface Mutation {
  name: string;
  hasResourceId?: boolean;
  hasServiceId?: boolean;
  hasParentId?: boolean;
  hasPayload?: boolean;
  hasRowId?: boolean;
}

export interface PageBuilder {
  type?: 'Outlet' | 'Page';
  name?: string;
  state?: object;
  params?: any & { serviceId?: string };
  query?: Query;
  form?: FormBuilder;
  filter?: FilterBuilder;
  table?: TableBuilder;
}

export interface FilterBuilder {}

export interface TableBuilder {
  query?: object;
  meta?: any;
  selection?: Key[] | 'all';
  buttons?: ButtonBuilder[];
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
