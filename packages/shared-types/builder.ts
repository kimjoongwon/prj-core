import { type InputProps, Selection, TableProps } from '@heroui/react';
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
  visibleCondition?: {
    eq: {
      path: string;
      value: any;
    };
  };
  type: string;
  props?: any;
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
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  name: string;
  mutation?: Mutation;
  navigator?: Navigator;
  alert?: Alert;
}
export interface CellButtonBuilder {
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  name: string;
  mutation?: CellMutation;
  navigator?: Navigator;
  alert?: Alert;
}
export interface Alert {
  message: string;
}

export interface Navigator {
  type?: 'push' | 'replace' | 'back';
  pathname?: string;
  idName?: string;
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
    | 'Modal'
    | 'Services'
    | 'Service'
    | 'Tab'
    | 'DataGrid';
}

export interface RouteBuilder {
  name?: string;
  pathname?: string;
  layout?: LayoutBuilder;
  page?: PageBuilder;
  params?: object;
  children?: RouteBuilder[];
}

export interface Query {
  name: string;
  params?: any;
  mapper?: any;
  idMapper?: any;
}

export interface Mutation {
  name: string;
  invalidationKey?: string;
  id?: string;
  payloadPath: string;
}

export interface CellMutation {
  name: string;
  idName?: string;
}

export type Key = string | number;

export interface PageState {
  form?: any;
  dataGrid?: {
    selectedRowIds?: Key[] | 'all';
    selectedRowId?: Key;
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
  table: TableBuilder;
}

export interface PageBuilder {
  type?: 'Outlet' | 'Page';
  name?: string;
  state?: PageState;
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
  cell?: CellBuilder;
}
export interface CellBuilder {
  type?: 'date' | 'time' | 'dateTime';
  buttons?: CellButtonBuilder[];
  expandable?: boolean;
  link?: string;
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
    CellBuilder {}

export interface SectionBuilder {
  name: string;
  stacks: StackBuilder[];
}

export interface StackBuilder {
  type: 'VStack' | 'HStack';
  inputs: InputBuilder[];
}
