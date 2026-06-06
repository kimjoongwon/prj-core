import {
	Autocomplete as HeroAutocomplete,
	Label,
	ListBox,
} from "@heroui/react";
import type { ReactNode } from "react";
import type { Key } from "react-aria-components";

type AutoCompleteItem = {
	/** 표시 텍스트 */
	label: string;
	/** 설명 텍스트 */
	description?: string;
	/** 아이템 고유 키 */
	key?: string;
};

export interface AutoCompleteProps {
	items?: AutoCompleteItem[];
	defaultItems?: AutoCompleteItem[];
	label?: ReactNode;
	placeholder?: ReactNode;
	isDisabled?: boolean;
	isInvalid?: boolean;
	isRequired?: boolean;
	className?: string;
	onSelectionChange?: (key: string | number | null) => void;
}

/**
 * AutoComplete 컴포넌트
 * 검색과 자동완성 기능이 있는 입력 컴포넌트입니다.
 */
export const AutoComplete = (props: AutoCompleteProps) => {
	const {
		defaultItems = [],
		items,
		label = "label",
		onSelectionChange,
		placeholder,
		...rest
	} = props;
	const collectionItems = items ?? defaultItems;

	const handleSelectionChange = (key: Key | null) => {
		onSelectionChange?.(key == null ? null : String(key));
	};

	return (
		<HeroAutocomplete
			{...rest}
			items={collectionItems as never}
			onSelectionChange={handleSelectionChange}
		>
			{label ? <Label>{label}</Label> : null}
			<HeroAutocomplete.Trigger>
				<HeroAutocomplete.Value>{placeholder}</HeroAutocomplete.Value>
				<HeroAutocomplete.Indicator />
			</HeroAutocomplete.Trigger>
			<HeroAutocomplete.Popover>
				<ListBox items={collectionItems as never}>
					{(item: AutoCompleteItem) => (
						<ListBox.Item key={item.key} id={item.key} textValue={item.label}>
							{item.label}
						</ListBox.Item>
					)}
				</ListBox>
			</HeroAutocomplete.Popover>
		</HeroAutocomplete>
	);
};
