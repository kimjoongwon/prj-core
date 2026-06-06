import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { Key } from "react-aria-components";
import {
	Select as BaseSelect,
	type SelectProps as BaseSelectProps,
} from "./Select";

export interface SelectProps<T>
	extends MobxProps<T>,
		Omit<BaseSelectProps, "value" | "onChange" | "options"> {
	options?: BaseSelectProps["options"];
}

export const Select = observer(<T extends object>(props: SelectProps<T>) => {
	const { state, path, options = [], ...rest } = props;

	const _options = tools.clone(options);

	const value = (_options as Array<{ value: string }>)?.find(
		(option) => option.value === tools.get(state, path),
	)?.value;

	const formField = useFormField({ value, state, path });

	const handleChange = (value: Key | null) => {
		formField.setValue(value == null ? "" : String(value));
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
