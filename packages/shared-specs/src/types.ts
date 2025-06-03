import { HeaderContext, CellContext } from '@tanstack/react-table';
import { ButtonProps, CardProps, TableProps, InputProps } from '..';
import type { RouteNames } from './routes';

export type BuilderOptionTypes = 'create' | 'modify' | 'detail' | 'add';

export type BuilderOptions = {
  id: string | 'new';
  type: BuilderOptionTypes;
  button: ButtonBuilder;
  sections: SectionBuilder[];
};

export type Validations = Record<string, any>;

export type Validation = {
  timings?: ('onBlur' | 'onChange' | 'onFocus')[];
  required?: { value: boolean; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  patterns?: { value: RegExp; message: string }[];
};

export type ValidationRecord<T extends object> = Omit<
  Record<keyof T, Validation>,
  'id' | 'createdAt' | 'updatedAt' | 'removedAt' | 'seq'
>;

export type ElementName =
  | 'Button'
  | 'Input'
  | 'Card'
  | 'Table'
  | 'Spacer'
  | 'Logo'
  | 'DateRangePicker'
  | 'Select'
  | 'DepotUploader'
  | 'Text'
  | 'Checkbox'
  | 'RadioGroup'
  | 'Switch'
  | 'Tabs'
  | 'Depot'
  | 'Textarea'
  | 'ButtonBuilder'
  | 'Copyright';

export interface ElementBuilder {
  visibleCondition?: {
    eq: {
      path: string;
      value: any;
    };
  };
  name: ElementName;
  props?: ElementProps<ElementName>;
  path?: string;
  validation?: Validation;
}

export type ElementProps<T extends ElementName> = T extends 'Button'
  ? ButtonProps
  : T extends 'Input'
  ? InputProps
  : T extends 'Card'
  ? CardProps
  : T extends 'Table'
  ? TableProps
  : T extends 'ButtonBuilder'
  ? ButtonProps & {
      apiKey?: string;
      color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    }
  : T extends 'Spacer'
  ? { size?: string }
  : T extends 'Copyright'
  ? { companyName?: string }
  : any;

export interface ButtonResponse<T> {
  routeName?: RouteNames;
  state?: PageState<any>;
  toast?: {
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    title: string;
    description: string;
  };
}

export interface FormBuilder {
  name?: string;
  validations?: Validations;
  isInValid?: boolean;
  sections?: SectionBuilder[];
  button?: ButtonBuilder;
}

export interface ButtonBuilder extends ButtonProps {
  apiKey?: string;
  name?: string;
  state?: PageState<any>;
}

export interface CellButtonBuilder {
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  name: string;
  apiKey?: string;
  toast?: {
    title: string;
    description: string;
  };
}

export interface AlertBuilder {
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

export type PageTypes = 'cretea' | 'modify' | 'detail' | 'add';
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
  // type?:
  //   | 'Outlet'
  //   | 'Auth'
  //   | 'Modal'
  //   | 'Services'
  //   | 'Service'
  //   | 'Tab'
  //   | 'DataGrid';
  type?: string;
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
    button?: {
      errorMessages?: string[];
    };
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
  name?: string;
  bordered?: boolean;
  stacks: StackBuilder[];
  style?: React.CSSProperties;
}

export interface StackBuilder {
  type: 'VStack' | 'HStack';
  elements: ElementBuilder[];
}

export interface DepotUploaderOptions {
  path: string;
  label?: string;
  type: 'file' | 'image';
}

export interface Route {
  name: string;
  pathname: string;
  active?: boolean;
  params: any;
  icon?: string;
  visible?: boolean;
  onClick?: () => void;
  children?: Route[];
}

export type CommonEntities =
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'removedAt'
  | 'seq';

export type State<T> = {
  form: {
    elements: T;
  };
};

export type PageTypeParams = {
  type: 'add' | 'edit' | 'read';
};

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

export type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[],
];

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : '';

export type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : '';

export interface MobxProps<T = any> {
  path: Paths<T, 4>;
  state: T;
}
