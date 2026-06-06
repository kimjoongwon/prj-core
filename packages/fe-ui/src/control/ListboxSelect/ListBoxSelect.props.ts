import type { Key } from "react-aria-components";

export type ListBoxSelectMode = "single" | "multiple";

export interface ListBoxSelectOption {
	text: string;
	value: Key;
}

export type ListBoxSelectValue = Key | Key[] | null;

export interface ListBoxSelectProps {
	title?: string;
	selectionMode?: ListBoxSelectMode;
	value?: ListBoxSelectValue;
	defaultValue?: ListBoxSelectValue;
	onChange?: (value: ListBoxSelectValue) => void;
	options?: ListBoxSelectOption[];
	className?: string;
	"aria-label"?: string;
}
