import type { ListBoxProps as HeroListBoxProps } from "@heroui/react";
import { ListBox as HeroListBox } from "@heroui/react";
import type { ReactNode } from "react";
import type { Key, Selection } from "react-aria-components";

export interface ListBoxItemOption {
	text: string;
	value: Key;
	isDisabled?: boolean;
	description?: ReactNode;
}

export type ListBoxValue = Key | Key[] | null;

export interface ListBoxProps
	extends Omit<
		HeroListBoxProps<object>,
		| "children"
		| "items"
		| "selectedKeys"
		| "defaultSelectedKeys"
		| "onSelectionChange"
	> {
	options?: ListBoxItemOption[];
	selectionMode?: "single" | "multiple";
	title?: ReactNode;
	value?: ListBoxValue;
	defaultValue?: ListBoxValue;
	onChange?: (value: ListBoxValue) => void;
}

const toSelectionSet = (
	value: ListBoxValue | undefined,
): Set<Key> | undefined => {
	if (value === undefined) {
		return undefined;
	}

	if (value == null) {
		return new Set();
	}

	return new Set(Array.isArray(value) ? value : [value]);
};

const toSelectionValue = (
	selection: Selection,
	selectionMode: "single" | "multiple",
): ListBoxValue => {
	if (selection === "all") {
		return selectionMode === "single" ? null : [];
	}

	const selectedValues = Array.from(selection);
	return selectionMode === "single"
		? (selectedValues[0] ?? null)
		: selectedValues;
};

export const ListBox = (props: ListBoxProps) => {
	const {
		className,
		options = [],
		selectionMode = "single",
		title,
		value,
		defaultValue,
		onChange,
		"aria-label": ariaLabel,
		...rest
	} = props;

	const handleSelectionChange = (selection: Selection) => {
		const selected = toSelectionValue(selection, selectionMode);
		onChange?.(selected);
	};

	return (
		<div className="w-full">
			{title && (
				<div className="mb-2">
					<h6 className="text-base font-semibold">{title}</h6>
				</div>
			)}
			<HeroListBox
				{...rest}
				aria-label={ariaLabel ?? "리스트"}
				className={className ?? "w-full"}
				selectionMode={selectionMode}
				items={options}
				selectedKeys={toSelectionSet(value)}
				defaultSelectedKeys={toSelectionSet(defaultValue)}
				onSelectionChange={handleSelectionChange}
			>
				{(item) => (
					<HeroListBox.Item
						key={item.value}
						id={item.value}
						textValue={item.text}
						isDisabled={item.isDisabled}
					>
						{item.text}
						{item.description ? (
							<p className="text-tiny text-default-500 mt-1">
								{item.description}
							</p>
						) : null}
					</HeroListBox.Item>
				)}
			</HeroListBox>
		</div>
	);
};
