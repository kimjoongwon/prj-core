import { type InputProps, Selection, TableProps } from '@nextui-org/react';
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

export interface Option {
  key: string;
  text: string;
  value: any;
}

export interface LayoutBuilder {
  name?: string;
  pathOptions?: Option[];
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
    | 'Detail'
    | 'Tab';
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
  mapper?: any;
  idMapper?: string;
  hasResourceId?: boolean;
  hasServiceId?: boolean;
  hasParentId?: boolean;
  hasPayload?: boolean;
  hasRowId?: boolean;
}

export type Key = string | number;

export interface PageState {
  form?: {
    data?: any;
  };
  dataGrid?: {
    selectedRowIds?: Key[];
    selectedRowId: Key;
    filter?: any;
    sortings?: any;
  };
}

export interface TabBuilder {
  options: Option[];
}

export interface DataGridBuilder {
  buttons?: ButtonBuilder[];
  filter?: FilterBuilder;
  table?: TableBuilder;
}

export interface PageBuilder {
  type?: 'Outlet' | 'Page';
  name?: string;
  state?: PageState;
  params?: any & { serviceId?: string };
  query?: Query;
  form?: FormBuilder;
  dataGrid?: DataGridBuilder;
}

export interface FilterBuilder {}

export interface TableState {
  filter?: unknown;
  selection?: Selection;
  pagination?: {
    take: number;
    skip: number;
  };
}

export interface TableBuilder extends TableProps {
  state?: TableState;
  query?: Query;
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
