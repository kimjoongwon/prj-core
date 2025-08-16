import type { AutocompleteProps } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

type AutoCompleteItem = {
	label: string;
	description?: string;
	key?: string;
};

export interface AutoCompleteProps
	extends Omit<AutocompleteProps<AutoCompleteItem>, "children" | "onSelectionChange"> {
	onSelectionChange?: (key: string | number | null) => void;
}

export const AutoComplete = (props: AutoCompleteProps) => {
	const {
		defaultItems = [],
		label = "label",
		onSelectionChange,
		...rest
	} = props;

	return (
		<Autocomplete
			{...rest}
			label={label}
			defaultItems={defaultItems}
			onSelectionChange={onSelectionChange}
		>
			{(item) => (
				<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
			)}
		</Autocomplete>
	);
};
