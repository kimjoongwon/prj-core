import type {
  ButtonProps,
  LinkProps,
  ModalProps,
  SwitchProps as NextUISwitchProps,
  DatePickerProps as HeroUiDatePickerProps,
  DateRangePickerProps as HeroUiDateRangePickerProps,
  TextAreaProps,
  TimeInputProps as HeroUiTimeInputProps,
  CheckboxProps as NextUICheckboxProps,
  InputProps,
  AutocompleteProps,
  SelectProps as NextUISelectProps,
} from '@heroui/react';
import type { HeaderContext } from '@tanstack/react-table';
import type { Leaves, MobxProps, Route, Option } from './types';
import type { ReactNode } from 'react';

// Form and component props interfaces
export interface FormUnitProps<T> {
  state: T;
  path: Leaves<T, 4>;
}

export interface HeaderCellProps<T, M> {
  headerContext: HeaderContext<T, string>;
  mobxProps: MobxProps<M>;
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Table and data grid related interfaces
export interface PaginationState {
  skip: number;
  take: number;
}

export interface QuerySorting {
  query: {
    sortingKey?: string;
    sortingValue?: 'asc' | 'desc';
    skip: number;
    take: number;
  };
}

export interface SearchFilterState<T extends object> {
  filter?: {
    [key in keyof T]?: string;
  };
}

// TableState moved to types.ts to avoid conflicts
// Use the TableState from types.ts instead

// Button and UI component interfaces
export interface GroupButton extends ButtonProps {
  href?: LinkProps['href'];
}

// FileUploader related types
export interface UploadedMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface SortableMediaProps {
  media: Partial<any>; // TODO: Replace with proper FileDto type when available
  onRemove: (id: string) => void;
}

export interface MediaUploadProps {
  mode: 'single' | 'multiple';
  maxFiles?: number;
}

export interface VideoPlayerProps {
  src: string;
}

export interface FileUploaderProps {
  onUpload?: (files: UploadedMedia[]) => void;
  maxFiles?: number;
  accept?: string;
}

// Stack component interfaces
export interface VStackProps {
  children: React.ReactNode;
  className?: string;
}

export interface HStackProps {
  children: React.ReactNode;
  className?: string;
}

// Component specific interfaces from components folder (moved from ui.ts)
// Re-export component layout interfaces to ui.ts to avoid circular dependencies

// Text component variant type
export const textVariants = {
  base: 'font-pretendard',
  variants: {
    variant: {
      h1: 'text-4xl font-bold text-black',
      h2: 'text-3xl font-bold text-black',
      h3: 'text-2xl font-bold text-black',
      h4: 'text-xl font-bold text-black',
      h5: 'text-lg font-bold text-black',
      h6: 'text-base font-bold text-black',
      caption: 'text-sm font-normal text-gray-500',
      subtitle1: 'text-base font-normal text-gray-500',
      subtitle2: 'text-sm font-normal text-gray-500',
      body1: 'text-base font-normal text-black',
      body2: 'text-sm font-normal text-black',
      title: 'text-xl font-normal text-black',
      label: 'text-sm font-semiBold text-gray-500',
      text: 'text-base font-normal text-black',
    },
  },
  defaultVariants: {
    variant: 'body1',
  },
} as const;

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'caption'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'title'
    | 'label'
    | 'text';
}

export interface SearchProps<T> extends MobxProps<T> {
  queryState: any;
}

export interface CopyrightProps {
  companyName: string;
  className?: string;
}

export interface CopyrightViewProps extends CopyrightProps {}

export interface CoCModalProps extends ModalProps {
  children: React.ReactNode;
}

export interface MainLayoutProps {
  children: React.ReactNode;
}

export interface TableLayoutProps {
  children: React.ReactNode;
}

export interface SwitchProps<T> extends NextUISwitchProps, MobxProps<T> {}

export interface BaseTextareaProps<T> extends TextAreaProps, MobxProps<T> {}

export interface DatePickerProps<T>
  extends HeroUiDatePickerProps,
    MobxProps<T> {}

export interface DateRangePickerProps<T extends object>
  extends HeroUiDateRangePickerProps,
    MobxProps<T> {}

export interface TimeInputProps<T> extends HeroUiTimeInputProps, MobxProps<T> {}

export interface CheckboxProps<T> extends MobxProps<T>, NextUICheckboxProps {}

export interface BreadcrumbItem {
  name: string;
  pathname?: string;
  active?: boolean;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: string | React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
  maxItems?: number;
  showHomeIcon?: boolean;
  homeRouteName?: string;
  onItemClick?: (item: BreadcrumbItem | Route) => void;
}

export interface BreadcrumbBuilderProps {
  routeNames: string[];
  separator?: string | React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}

export interface CategoryCardProps {
  category: any; // CategoryDto type would be imported from model
  selected?: boolean;
  onClickEdit?: (category: any) => void;
  onClickDelete?: (category: any) => void;
  onClickCard?: (category: any) => void;
  onClickDetail?: (category: any) => void;
  onClickCreate?: (category: any) => void;
}

export interface FileUploaderProps {
  onUpload?: (files: UploadedMedia[]) => void;
  maxFiles?: number;
  accept?: string;
}

export interface SelectProps<T>
  extends Omit<NextUISelectProps, 'children'>,
    MobxProps<T> {
  options?: Option[];
}

export interface DepotProps<T> extends MobxProps<T> {
  uploadPath: string;
  maxFiles?: number;
}

export interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  horizontal?: boolean;
  className?: string;
  placeholder?: ReactNode;
}

export interface MultiInputProps<T> extends MobxProps<T>, InputProps {}

export type EmailProps<T> = any & {
  validation?: any; // Validation type would be imported
};

// CalendarInput related types
export interface CalendarInputProps<T> extends MobxProps<T> {}

export interface CalendarInputPropsView {
  readOnly?: boolean;
  state: any; // ReturnType<typeof useProps>['state']
}

export type ISOString = string;

export interface DateModel {
  value: string;
  selected: boolean;
  selectDate: () => void;
  className?: string;
  isPressable?: boolean;
}

// State interface moved to types.ts to avoid conflicts
// Use the State<T> type from types.ts instead

export interface HeaderProps {
  state: any; // ReturnType<typeof useProps>['state']
}

export interface YearProps {
  state: any; // ReturnType<typeof useProps>['state']
}

export interface DateViewProps {
  dateModel: DateModel;
}

export interface DatesProps {
  state: any; // ReturnType<typeof useProps>['state']
}

export interface DatesViewProps {
  state: any; // ReturnType<typeof useProps>['state']
}

export enum Months {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11,
}

// Builder related interfaces
export interface InputBuilderProps {
  inputBuilder: any; // InputBuilderInterface
  data?: (unknown & { id: string })[];
}

export interface VideoUploaderProps {
  label?: string;
}

// Option interface moved to types.ts to avoid conflicts
// Use the Option interface from types.ts instead

export interface TabsProps<T> extends MobxProps<T> {
  options: Option[];
}

export interface AppBarProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
}

export interface AppBarViewProps extends AppBarProps {}

export interface MessageProps {
  title: string;
  message: string;
}

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface FormGroupControlProps {
  direction?: 'row' | 'col';
  children: React.ReactNode;
}

export interface MetaProps {
  name: string;
  value: string;
}

export interface MetaViewProps extends MetaProps {}

export interface SectionProps {
  children: React.ReactNode;
}

export interface ChipsProps<T> extends MobxProps<T> {}

// AutoComplete component types
export interface BaseAutoCompleteProps<T>
  extends Omit<AutocompleteProps, 'children'>,
    MobxProps<T> {
  options: {
    text: string;
    value: any;
    description?: string;
  }[];
}

export interface ButtonGroupProps {
  leftButtons?: GroupButton[];
  rightButtons?: GroupButton[];
}

export interface DepotProps<T>
  extends MobxProps<T>,
    Omit<FileUploaderProps, 'onFilesChange' | 'value'> {}

export type RecurringDayOfTheWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';
