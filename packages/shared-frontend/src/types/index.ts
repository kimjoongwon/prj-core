import type {
	AutocompleteProps,
	ButtonProps,
	ListboxProps as HeroListboxProps,
	DatePickerProps as HeroUiDatePickerProps,
	DateRangePickerProps as HeroUiDateRangePickerProps,
	TimeInputProps as HeroUiTimeInputProps,
	LinkProps,
	ModalProps,
	CheckboxProps as NextUICheckboxProps,
	InputProps as NextUIInputProps,
	SelectProps as NextUISelectProps,
	SwitchProps as NextUISwitchProps,
	TextAreaProps,
} from "@heroui/react";
import type { HeaderContext } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${"" extends P ? "" : "."}${P}`
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
		: "";

export type Leaves<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
		? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
		: "";

export interface MobxProps<T = any> {
	path: Paths<T, 4>;
	state: T;
}
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

// Responsive visibility component interface
export interface ResponsiveVisibilityProps {
	/** The children components to show/hide */
	children: React.ReactNode;
	/** Device type - 'mobile' will hide on mobile, 'pc' will hide on desktop */
	device: "mobile" | "pc";
	/** Breakpoint for responsive behavior (default: 'xl' - 1280px) */
	breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
	/** Additional CSS classes */
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
		sortingValue?: "asc" | "desc";
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
	href?: LinkProps["href"];
}

// FileUploader related types
export interface UploadedMedia {
	id: string;
	url: string;
	type: "image" | "video";
}

export interface SortableMediaProps {
	media: Partial<any>; // TODO: Replace with proper FileDto type when available
	onRemove: (id: string) => void;
}

export interface MediaUploadProps {
	mode: "single" | "multiple";
	maxFiles?: number;
}

export interface VideoPlayerProps {
	src: string;
}

// Stack component interfaces
export type VStackProps = {
	children?: React.ReactNode;
	className?: string;
	alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
	justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
	fullWidth?: boolean;
	gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
};

export interface HStackProps {
	children?: React.ReactNode;
	className?: string;
	alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
	justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
	fullWidth?: boolean;
	gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
}

// Component specific interfaces from components folder (moved from ui.ts)
// Re-export component layout interfaces to ui.ts to avoid circular dependencies

// Text component variant type
export const textVariants = {
	base: "font-pretendard",
	variants: {
		variant: {
			h1: "text-4xl font-bold text-black",
			h2: "text-3xl font-bold text-black",
			h3: "text-2xl font-bold text-black",
			h4: "text-xl font-bold text-black",
			h5: "text-lg font-bold text-black",
			h6: "text-base font-bold text-black",
			caption: "text-sm font-normal text-gray-500",
			subtitle1: "text-base font-normal text-gray-500",
			subtitle2: "text-sm font-normal text-gray-500",
			body1: "text-base font-normal text-black",
			body2: "text-sm font-normal text-black",
			title: "text-xl font-normal text-black",
			label: "text-sm font-semiBold text-gray-500",
			text: "text-base font-normal text-black",
		},
	},
	defaultVariants: {
		variant: "body1",
	},
} as const;

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
	variant?:
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6"
		| "caption"
		| "subtitle1"
		| "subtitle2"
		| "body1"
		| "body2"
		| "title"
		| "label"
		| "text"
		| "error";
	as?: React.ElementType;
	children?: React.ReactNode;
	truncate?: boolean;
	lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | "none";
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
	// onItemClick?: (item: BreadcrumbItem | Route) => void;
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

export interface FileUploaderProps<T = any> extends MobxProps<T> {
	label?: string;
	type: "image" | "video" | "all";
	onFilesChange?: (
		type: FileUploaderProps<T>["type"],
		fileDtos: Partial<any>[],
	) => void;
	onFileRemove?: (fileDto: Partial<any>) => void;
}

export interface Option{
	key: string;
	value: string;
	label: string;
}

export interface SelectProps<T>
	extends Omit<NextUISelectProps, "children">,
		MobxProps<T> {
	options?: Option[];
}

export interface ListProps<T> {
	data: T[];
	renderItem: (item: T) => ReactNode;
	horizontal?: boolean;
	className?: string;
	placeholder?: ReactNode;
}

export interface MultiInputProps<T> extends MobxProps<T>, NextUIInputProps {}

export type EmailProps<_T> = any & {
	validation?: any; // Validation type would be imported
};

// Calendar related types
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

export interface CalendarHeaderProps {
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
export interface VideoUploaderProps {
	label?: string;
}

// Option interface moved to types.ts to avoid conflicts
// Use the Option interface from types.ts instead

export interface TabsProps<T> extends MobxProps<T> {
	options: Option[];
}

export interface HeaderProps {
	left?: React.ReactNode;
	center?: React.ReactNode;
	right?: React.ReactNode;
}

export interface DashboardLayoutProps {
	header?: React.ReactNode;
	leftSidebar?: React.ReactNode;
	rightSidebar?: React.ReactNode;
	bottom?: React.ReactNode;
	breadcrumb?: React.ReactNode;
	children: React.ReactNode;
}

// export interface BottomTabProps {
// 	routes: Route[];
// 	className?: string;
// 	activeColor?: "primary" | "secondary" | "success" | "warning" | "danger";
// 	inactiveColor?: "default" | "secondary";
// 	variant?: "light" | "solid" | "bordered" | "ghost";
// 	size?: "sm" | "md" | "lg";
// 	showLabels?: boolean;
// 	iconSize?: number;
// 	onTabPress?: (route: Route) => void;
// }

export interface AppBarProps extends HeaderProps {}
export interface AppBarViewProps extends HeaderProps {}

export interface MessageProps {
	title: string;
	message: string;
}

export interface LayoutProps {
	children: React.ReactNode;
	className?: string;
}

export interface FormGroupControlProps {
	direction?: "row" | "col";
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
	extends Omit<
			AutocompleteProps<{
				label: string;
				description?: string;
				key?: string;
			}>,
			"children"
		>,
		MobxProps<T> {}

// TenantAutoComplete component types
export interface TenantAutoCompleteProps
	extends Omit<
		AutocompleteProps,
		"children" | "selectedKey" | "onSelectionChange"
	> {
	/** Additional CSS classes */
	className?: string;
	/** Callback function called when a tenant is selected */
	onTenantSelect?: (tenantId: string) => void;
}

export interface ButtonGroupProps {
	leftButtons?: GroupButton[];
	rightButtons?: GroupButton[];
}

export interface DepotProps<T>
	extends MobxProps<T>,
		Omit<FileUploaderProps<T>, "onFilesChange"> {}

export type RecurringDayOfTheWeek =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";

export type ListboxProps<T> = Omit<HeroListboxProps, "state" | "children"> &
	MobxProps<T> & {
		title?: string;
		options:
			| {
					text: string;
					value: any;
			  }[]
			| undefined;
	};

export type InputProps<T> = MobxProps<T> &
	NextUIInputProps & {
		validation?: Validation;
	};

export type Validation = {
	timings?: ("onBlur" | "onChange" | "onFocus")[];
	required?: { value: boolean; message: string };
	minLength?: { value: number; message: string };
	maxLength?: { value: number; message: string };
	min?: { value: number; message: string };
	max?: { value: number; message: string };
	patterns?: { value: RegExp | string; message: string }[];
};

export interface SpacerProps {
	/**
	 * Size of spacer in Tailwind's spacing units (0.25rem increments)
	 * 1 = 0.25rem (4px)
	 * 2 = 0.5rem (8px)
	 * 3 = 0.75rem (12px)
	 * 4 = 1rem (16px)
	 * and so on...
	 */
	size?: number;

	/**
	 * Direction of the spacer - horizontal or vertical
	 */
	direction?: "horizontal" | "vertical";

	/**
	 * Optional additional className
	 */
	className?: string;
}

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
