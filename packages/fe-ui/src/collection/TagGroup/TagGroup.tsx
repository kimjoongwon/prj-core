import type { TagGroupProps as HeroTagGroupProps } from "@heroui/react";
import { TagGroup as HeroTagGroup, Tag } from "@heroui/react";
import type { Key, Selection } from "react-aria-components";

export interface TagGroupItemOption {
	text: string;
	value: Key;
	isDisabled?: boolean;
}

export type TagGroupValue = Key | Key[] | null;

export interface TagGroupProps
	extends Omit<
		HeroTagGroupProps,
		"children" | "selectedKeys" | "defaultSelectedKeys" | "onSelectionChange"
	> {
	options?: TagGroupItemOption[];
	selectionMode?: "single" | "multiple";
	value?: TagGroupValue;
	defaultValue?: TagGroupValue;
	onChange?: (value: TagGroupValue) => void;
}

const toSelectionSet = (
	value: TagGroupValue | undefined,
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
): TagGroupValue => {
	if (selection === "all") {
		return selectionMode === "single" ? null : [];
	}

	const selectedValues = Array.from(selection);
	return selectionMode === "single"
		? (selectedValues[0] ?? null)
		: selectedValues;
};

export const TagGroup = (props: TagGroupProps) => {
	const {
		options = [],
		selectionMode = "multiple",
		value,
		defaultValue,
		onChange,
		className,
		"aria-label": ariaLabel,
		...rest
	} = props;

	const handleSelectionChange = (selection: Selection) => {
		const selected = toSelectionValue(selection, selectionMode);
		onChange?.(selected);
	};

	return (
		<HeroTagGroup
			{...rest}
			aria-label={ariaLabel ?? "태그 그룹"}
			className={className ?? "w-full"}
			selectionMode={selectionMode}
			selectedKeys={toSelectionSet(value)}
			defaultSelectedKeys={toSelectionSet(defaultValue)}
			onSelectionChange={handleSelectionChange}
		>
			<HeroTagGroup.List>
				{options.map((option) => (
					<Tag
						key={option.value}
						id={option.value}
						textValue={option.text}
						isDisabled={option.isDisabled}
					>
						{option.text}
					</Tag>
				))}
			</HeroTagGroup.List>
		</HeroTagGroup>
	);
};
