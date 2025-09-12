import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import { tools } from "@shared/utils";
import { action } from "mobx";
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

	const initialValue = _options?.find(
		(option) => option.value === tools.get(state, path),
	)?.value;

	const { localState } = useFormField({ initialValue, state, path });

	const handleChange = action((value: string) => {
		localState.value = value;
	});

	return (
		<BaseSelect
			{...rest}
			options={options}
			value={localState.value}
			onChange={handleChange}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseSelectProps as PureSelectProps };
