import { ListBox as HeroListBox } from "@heroui/react";
import type { Key, Selection } from "react-aria-components";
import { ListBoxWrapper } from "./ListBoxWrapper";
import type {
	ListBoxSelectProps,
	ListBoxSelectValue,
} from "./ListBoxSelect.props";

const toSelectionSet = (
	value: ListBoxSelectValue | undefined,
): Set<Key> | undefined => {
	if (value === undefined) {
		return undefined;
	}

	if (value == null) {
		return new Set();
	}

	return new Set(Array.isArray(value) ? value : [value]);
};

export const ListBoxSelect = (props: ListBoxSelectProps) => {
	const {
		className,
		defaultValue,
		options = [],
		selectionMode = "multiple",
		title,
		value,
		onChange,
		"aria-label": ariaLabel,
	} = props;

	const handleSelectionChange = (selection: Selection) => {
		if (selection === "all") {
			const allValues = options.map((option) => option.value);
			onChange?.(selectionMode === "single" ? (allValues[0] ?? null) : allValues);
			return;
		}

		const selectedValues = Array.from(selection);
		onChange?.(
			selectionMode === "single"
				? (selectedValues[0] ?? null)
				: selectedValues,
		);
	};

	return (
		<ListBoxWrapper>
			{title && (
				<div className="mb-3">
					<h6 className="text-base font-bold font-semibold">{title}</h6>
				</div>
				)}
				<HeroListBox
					aria-label={ariaLabel ?? title ?? "선택"}
					className={className ?? "w-full"}
					selectionMode={selectionMode}
					items={options}
					variant="default"
					selectedKeys={toSelectionSet(value)}
					defaultSelectedKeys={toSelectionSet(defaultValue)}
					onSelectionChange={handleSelectionChange}
				>
					{(item) => {
						return (
							<HeroListBox.Item
								className="w-full"
								key={item.value}
								id={item.value}
								textValue={item.text}
							>
								{item.text}
							</HeroListBox.Item>
						);
				}}
			</HeroListBox>
			</ListBoxWrapper>
	);
};
