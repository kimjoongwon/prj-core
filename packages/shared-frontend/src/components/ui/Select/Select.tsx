import {
	Select as NextSelect,
	SelectProps as NextUISelectProps,
	SelectItem,
} from "@heroui/react";
import { cloneDeep, get } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useMobxHookForm } from "../../../hooks";
import type { MobxProps, Option } from "../../../types";

interface SelectProps<T>
	extends Omit<NextUISelectProps, "children">,
		MobxProps<T> {
	options?: Option[];
}

export const Select = observer(<T extends object>(props: SelectProps<T>) => {
	const { state = {}, path = "", options = [], value, ...rest } = props;

	const _options = cloneDeep(options);

	const initialValue =
		_options?.find((option) => option.value === get(state, path))?.value ||
		value;

	const { localState } = useMobxHookForm(initialValue, state, path);

	return (
		<NextSelect
			variant="bordered"
			{...rest}
			onChange={(e) => {
				localState.value = e.target.value;
			}}
			selectedKeys={localState.value ? [localState.value] : undefined}
		>
			{_options.map((option) => {
				return (
					<SelectItem key={option.key} textValue={option.value}>
						{option.label}
					</SelectItem>
				);
			})}
		</NextSelect>
	);
});
