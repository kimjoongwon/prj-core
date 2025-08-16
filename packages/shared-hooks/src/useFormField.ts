import { Tool } from "@shared/utils";
import { reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

export interface UseFormFieldOptions<TState = any, TValue = any>
	extends Pick<MobxProps<TState>, "state" | "path"> {
	initialValue: TValue;
}

export const useFormField = <TState = any, TValue = any>({
	initialValue,
	state,
	path,
}: UseFormFieldOptions<TState, TValue>) => {
	const localState = useLocalObservable(() => ({
		value: initialValue as TValue,
	}));

	useEffect(() => {
		const setterDisposer = reaction(
			() => localState.value,
			(value) => {
				Tool.set(state, path, value);
			},
		);

		const getterDisposer = reaction(
			() => Tool.get(state, path),
			(value) => {
				localState.value = value as TValue;
			},
		);

		return () => {
			setterDisposer();
			getterDisposer();
		};
	}, [localState, state, path]);

	return {
		localState: {
			get value(): TValue {
				return localState.value;
			},
			set value(newValue: TValue) {
				localState.value = newValue;
			},
		},
	};
};
import type { AutocompleteProps, ModalProps } from "@heroui/react";
import type { HeaderContext } from "@tanstack/react-table";

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

// FileUploader related types
export interface UploadedMedia {
	id: string;
	url: string;
	type: "image" | "video";
}

export interface MediaUploadProps {
	mode: "single" | "multiple";
	maxFiles?: number;
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

export interface CoCModalProps extends ModalProps {
	children: React.ReactNode;
}

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

export interface Option {
	key: string;
	value: string;
	label: string;
}

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

// Option interface moved to types.ts to avoid conflicts
// Use the Option interface from types.ts instead

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

export interface ChipsProps<T> extends MobxProps<T> {}

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

export type RecurringDayOfTheWeek =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";

export type Validation = {
	timings?: ("onBlur" | "onChange" | "onFocus")[];
	required?: { value: boolean; message: string };
	minLength?: { value: number; message: string };
	maxLength?: { value: number; message: string };
	min?: { value: number; message: string };
	max?: { value: number; message: string };
	patterns?: { value: RegExp | string; message: string }[];
};

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
