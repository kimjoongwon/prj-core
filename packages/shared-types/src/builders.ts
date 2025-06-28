import type { HeaderContext, CellContext } from '@tanstack/react-table';
import type {
  ButtonProps,
  CardProps,
  InputProps,
  TableProps,
  ListboxProps as HeroListboxProps,
} from '@heroui/react';
import { RouteNames } from './routes';

export type BuilderOptionTypes = 'create' | 'modify' | 'detail' | 'add';

export type BuilderOptions = {
  id: string | 'new';
  type: BuilderOptionTypes;
  button: IButtonBuilder;
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
  patterns?: { value: RegExp | string; message: string }[];
};

export type ButtonValidation = {
  required?: { value: boolean; message: string };
  patterns?: { value: RegExp | string; message: string }[];
};

export type ValidationRecord<T extends object> = Omit<
  Record<keyof T, Validation>,
  'id' | 'createdAt' | 'updatedAt' | 'removedAt' | 'seq'
>;

export type ElementName =
  | 'AutoComplete'
  | 'Avatar'
  | 'BottomTab'
  | 'Breadcrumb'
  | 'Button'
  | 'ButtonBuilder'
  | 'ButtonGroup'
  | 'CalendarInput'
  | 'Card'
  | 'CategoryCard'
  | 'Checkbox'
  | 'Chip'
  | 'Chips'
  | 'CollapsibleSidebar'
  | 'Container'
  | 'Copyright'
  | 'DarkModeSwitch'
  | 'DataGrid'
  | 'DatePicker'
  | 'DateRangePicker'
  | 'DepotUploader'
  | 'Dropdown'
  | 'Editor'
  | 'FileUploader'
  | 'Form'
  | 'FormGroup'
  | 'Header'
  | 'HStack'
  | 'Input'
  | 'Link'
  | 'List'
  | 'Listbox'
  | 'Logo'
  | 'Message'
  | 'Meta'
  | 'MultiInput'
  | 'MultiSelect'
  | 'Navbar'
  | 'NavbarItem'
  | 'NavigationSetup'
  | 'NotFound'
  | 'PageModal'
  | 'Pagination'
  | 'Placeholder'
  | 'RadioGroup'
  | 'ResponsiveVisibility'
  | 'Search'
  | 'Section'
  | 'Select'
  | 'Skeleton'
  | 'Spacer'
  | 'SplashScreen'
  | 'SubmitButton'
  | 'Switch'
  | 'Table'
  | 'Tabs'
  | 'TenantList'
  | 'Text'
  | 'Textarea'
  | 'TimeInput'
  | 'TimePicker'
  | 'User'
  | 'Videos'
  | 'VideoUploader'
  | 'VStack'
  | 'WeekInput'
  | 'WorkspaceSelect'
  | 'DataGridBuilder'
  | 'ResourceBuilder'
  | 'ListboxBuilder';

export interface ElementBuilder {
  visibleCondition?: {
    eq: {
      path: string;
      value: any;
    };
  };
  type?: 'input' | 'normal';
  name: ElementName;
  props?: ElementProps<ElementName>;
  path?: string;
  validation?: Validation;
  children?: ElementBuilder[];
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
      mutation?: Mutation;
      color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    }
  : T extends 'Spacer'
  ? { size?: string }
  : T extends 'Copyright'
  ? { companyName?: string }
  : any;

export interface ButtonResponse {
  routeName?: RouteNames;
  state?: PageState<unknown>;
  toast?: {
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    title: string;
    description: string;
  };
}

export interface IButtonBuilder extends ButtonProps {
  buttonType?: 'form' | 'cell' | 'general';
  mutation?: Mutation;
  name?: string;
  validation?: ButtonValidation;
  icon?: string;
  toast?: {
    title: string;
    description: string;
  };
  navigator?: Navigator;
}

export interface AlertBuilder {
  message: string;
}

export interface Navigator {
  type?: 'push' | 'replace' | 'back' | 'href';
  route?: {
    name?: RouteNames;
    fullPath?: string;
    relativePath?: string;
    params?: object;
    pathParams?: Record<string, string>; // 라우트 파라미터 키와 pageState 경로의 매핑
  };
}

export type PageTypes = 'create' | 'modify' | 'detail' | 'add';
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
  type?: string;
}

export interface RouteBuilder {
  name?: string;
  relativePath?: string;
  layout?: LayoutBuilder;
  page?: PageBuilder;
  params?: object;
  children?: RouteBuilder[];
  icon?: string;
}

export interface Query {
  name: string;
  pathParams?: Record<string, string>; // { groundId: 'id', testId: 'id' }
  params?: any;
}

export interface Mutation {
  name: string;
  hasId?: boolean; // true면 id가 body에 포함되어야 함
  // 인벨리데이션을 위한 키
  queryKey?: string;
  body?: any;
  path?: string;
  idPath?: string; // id가 포함된 경로
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
  params?: Record<string, string>; // 라우트 파라미터 키와 pageState 경로의 매핑
}

export interface TabBuilder {
  options: Option[];
}

export interface DataGridBuilder {
  buttons?: IButtonBuilder[];
  table: TableBuilder;
}

export interface ResourceBuilder extends ApiQueryBuilder {
  resourceName: string;
  sections?: SectionBuilder[];
}

export interface PageBuilder {
  type?: 'Outlet' | 'Page';
  name?: string;
  state?: any;
  query?: Query;
  sections?: SectionBuilder[];
}

// 통합 API 쿼리 시스템
export type QueryType = 'table' | 'list' | 'resource';

export interface ApiQueryBuilder {
  type: QueryType;
  query: Query;

  // 테이블 전용 옵션
  pagination?: {
    enabled: boolean;
    defaultTake?: number;
  };

  // 리스트 전용 옵션
  listOptions?: {
    valueField: string;
    labelField: string;
  };

  // 리소스 전용 옵션
  resourceName?: string;
}

export interface ApiQueryResult {
  data?: any;
  isLoading: boolean;
  error?: any;

  // 테이블 전용 반환값
  meta?: any;
  skip?: number;
  take?: number;
  setSkip?: (value: number) => void;
  setTake?: (value: number) => void;

  // 리스트 전용 반환값
  options?: Array<{ value: any; text: string }>;

  // 리소스 전용 반환값
  id?: string;
  type?: 'create' | 'modify' | 'detail' | 'add';
}

export interface TableState {
  filter?: unknown;
  selection?: Selection;
  pagination?: {
    take: number;
    skip: number;
  };
}

export interface TableBuilder extends TableProps, ApiQueryBuilder {
  state?: TableState;
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
  type?:
    | 'date'
    | 'time'
    | 'dateTime'
    | 'row-actions'
    | 'text'
    | 'number'
    | 'boolean'
    | 'expandable';
  link?: string;
  buttons?: IButtonBuilder[];
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
  fullPath: string;
  relativePath: string;
  active?: boolean;
  params?: any;
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

export interface ValtioProps<T = any> {
  path: Paths<T, 4>;
  state: T;
}
export interface SectionBuilderProps {
  sectionBuilder: SectionBuilder;
}
export interface TabNavigationProps {
  tabBuilder: TabBuilder;
}

// Builder interfaces moved from components.ts
export interface ListboxBuilderQuery {
  apiKey: string;
  params?: any;
  valueField: string;
  labelField: string;
}

export interface ListboxBuilderProps
  extends Omit<
    HeroListboxProps,
    'options' | 'value' | 'onChange' | 'children'
  > {
  path: string;
  query: ApiQueryBuilder;
}

export interface BreadcrumbBuilderProps {
  routeNames: string[];
  separator?: string | React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}

export interface DataGridBuilderProps extends DataGridBuilder {}

export interface ResourceBuilderProps extends ResourceBuilder {}

export interface InputBuilderProps {
  inputBuilder: any; // InputBuilderInterface
  data?: (unknown & { id: string })[];
}
