import {
	Select as NextSelect,
	type SelectProps as NextUISelectProps,
	SelectItem,
	type Selection,
} from "@heroui/react";

export interface MultiSelectProps<_T>
	extends Omit<
		NextUISelectProps,
		"children" | "selectionMode" | "onChange" | "selectedKeys"
	> {
	options?: any[];
	selectedKeys?: Selection;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const MultiSelect = <T extends object>(props: MultiSelectProps<T>) => {
	const { options = [], selectedKeys, onChange, ...rest } = props;

	return (
		<NextSelect
			{...rest}
			variant="bordered"
			selectionMode="multiple"
			selectedKeys={selectedKeys}
			onChange={onChange}
		>
			{options.map((option) => {
				return <SelectItem key={option.value}>{option.name}</SelectItem>;
			})}
		</NextSelect>
	);
};
