// UI-specific interfaces only - purely presentation/layout related
// All component interfaces moved to components.ts to avoid conflicts

export interface CalendarState {
  calendarInput: {
    header: {
      date: Date;
      increaseMonth: () => void;
      decreaseMonth: () => void;
    };
    dates: any[]; // Using any to avoid DateModel conflicts
  };
}

// Re-export from components.ts to maintain backward compatibility
export type {
  CalendarInputProps,
  CalendarInputPropsView,
  DateModel,
  DatePickerProps,
  SearchProps,
  SelectProps,
  SwitchProps,
  TextProps,
  BaseTextareaProps,
  BreadcrumbBuilderProps,
  BreadcrumbItem,
  BreadcrumbProps,
  CategoryCardProps,
  CoCModalProps,
  CopyrightProps,
  CopyrightViewProps,
  DepotProps,
  MainLayoutProps,
  Months,
  ISOString,
} from './components';
