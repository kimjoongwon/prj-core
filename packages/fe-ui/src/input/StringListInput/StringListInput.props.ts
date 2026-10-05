import type { ReactNode } from "react";

export interface StringListInputProps {
	value: string[];
	onChange: (value: string[]) => void;
	errors?: Record<number, ReactNode>;
	isReadOnly?: boolean;
	placeholder?: string;
	addLabel?: ReactNode;
	removeLabel?: string;
	className?: string;
	inputClassName?: string;
	emptyValue?: string;
}
