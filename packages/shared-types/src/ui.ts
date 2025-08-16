import type { AutocompleteProps, ModalProps } from "@heroui/react";
import type { HeaderContext } from "@tanstack/react-table";
import type { MobxProps } from "./mobx";

// Header cell props
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

// Modal related interfaces
export interface CoCModalProps extends ModalProps {
	children: React.ReactNode;
}

// Layout interfaces
export interface LayoutProps {
	children: React.ReactNode;
	className?: string;
}

// Breadcrumb interfaces
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