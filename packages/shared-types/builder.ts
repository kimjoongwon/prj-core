import { Selection, TableProps } from '@heroui/react';
import { HeaderContext, CellContext } from '@tanstack/react-table';

export type Validations = Record<string, any>;
export type Validation = {
  timings?: ('onBlur' | 'onChange' | 'onFocus')[];
  required?: { value: boolean; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  patterns?: { value: string; message: string }[];
};

export type ValidationRecord<T extends object> = Omit<
  Record<keyof T, Validation>,
  'id' | 'createdAt' | 'updatedAt' | 'removedAt' | 'seq'
>;

export interface InputBuilder {
  visibleCondition?: {
    eq: {
      path: string;
      value: any;
    };
  };
  type?: string;
  props?: any;
  path?: string;
  validation?: Validation;
}

export interface FormBuilder {
  name?: string;
  validations?: Validations;
  isInValid?: boolean;
  sections?: SectionBuilder[];
  button?: ButtonBuilder;
}

export interface ButtonBuilder {
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  name: string;
  mutation?: Mutation;
  navigator?: Navigator;
  alert?: Alert;
  toast?: {
    title: string;
    description: string;
  };
}

export interface CellButtonBuilder {
  icon?: string;
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
  params?: any;
  payloadPath?: string;
}

export type Key = string | number;

export interface PageState<CDO> {
  form?: {
    inputs: CDO;
    errorMessages?: string[];
  };
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

export interface PageBuilder<CDO = any> {
  type?: 'Outlet' | 'Page';
  name?: string;
  state?: PageState<CDO>;
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

export interface DepotUploaderOptions {
  path: string;
  label?: string;
  type: 'file' | 'image';
}
