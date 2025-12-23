import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	Select as BaseSelect,
	type SelectProps as BaseSelectProps,
} from "./Select";

export interface SelectProps<T>
	extends MobxProps<T>,
		Omit<BaseSelectProps, "value" | "onChange"> {}

export const Select = observer(<T extends object>(props: SelectProps<T>) => {
	const { state, path, options = [], ...rest } = props;

	const _options = tools.cloneDeep(options);

	const value = _options?.find(
		(option) => option.value === tools.get(state, path),
	)?.value;

	const formField = useFormField({ value, state, path });

	const handleChange = (value: string) => {
		formField.setValue(value);
	};

	return (
		<BaseSelect
			{...rest}
			options={options}
			value={formField.state.value}
			onChange={handleChange}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseSelectProps as PureSelectProps };
