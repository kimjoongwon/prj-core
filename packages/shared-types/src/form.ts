import type { MobxProps } from "./mobx";

// Form related interfaces
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

// Common option interface
export interface Option {
	key: string;
	value: string;
	label: string;
}

// Email props type
export type EmailProps<_T> = any & {
	validation?: any; // Validation type would be imported
};

// Validation types
export type Validation = {
	timings?: ("onBlur" | "onChange" | "onFocus")[];
	required?: { value: boolean; message: string };
	minLength?: { value: number; message: string };
	maxLength?: { value: number; message: string };
	min?: { value: number; message: string };
	max?: { value: number; message: string };
	patterns?: { value: RegExp | string; message: string }[];
};