"use client";

import { useFormField } from "@cocrepo/hook";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { Key } from "react-aria-components";
import {
	Select as PureSelect,
	type SelectProps as PureSelectProps,
} from "./Select";

export type SelectProps<T extends object = object> =
	| (MobxProps<T> &
			Omit<PureSelectProps, "value" | "onChange" | "options"> & {
				options?: PureSelectProps["options"];
			})
	| PureSelectProps;

function isBoundSelectProps<T extends object>(
	props: SelectProps<T>,
): props is MobxProps<T> &
	Omit<PureSelectProps, "value" | "onChange" | "options"> {
	return "state" in props && "path" in props;
}

const BoundSelect = observer(<T extends object>(props: MobxProps<T> & Omit<PureSelectProps, "value" | "onChange" | "options"> & { options?: PureSelectProps["options"] }) => {
	const { state, path, options = [], ...rest } = props;

	const formField = useFormField({ defaultValue: "", state, path });

	const handleChange = (value: Key | null) => {
		formField.setValue(value == null ? "" : String(value));
	};

	return (
		<PureSelect
			{...rest}
			options={options}
			value={formField.state.value}
			onChange={handleChange}
		/>
	);
});

const Select = <T extends object>(props: SelectProps<T>) =>
	isBoundSelectProps(props) ? <BoundSelect {...props} /> : <PureSelect {...props} />;

export type { SelectState } from "./Select";
export { createSelectState } from "./Select";
export type { PureSelectProps };
export { Select };
