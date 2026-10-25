"use client";

import { useFormField } from "@cocrepo/hook";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { StringListInput as PureStringListInput } from "./StringListInput";
import type { StringListInputProps as PureStringListInputProps } from "./StringListInput.props";

type BoundStringListInputProps<T> = MobxProps<T> &
	Omit<PureStringListInputProps, "onChange" | "value">;

export type StringListInputProps<T = object> =
	| BoundStringListInputProps<T>
	| PureStringListInputProps;

function isBoundStringListInputProps<T>(
	props: StringListInputProps<T>,
): props is BoundStringListInputProps<T> {
	return "state" in props && "path" in props;
}

const StringListInput = observer(
	<T extends object>(props: StringListInputProps<T>) => {
		if (!isBoundStringListInputProps(props)) {
			return <PureStringListInput {...props} />;
		}

		const { path, state, ...rest } = props;
		const formField = useFormField<T, string[]>({
			path,
			state,
			defaultValue: [],
		});

		return (
			<PureStringListInput
				{...rest}
				value={formField.state.value as string[]}
				onChange={formField.setValue}
			/>
		);
	},
);

export { StringListInput };
export { createStringListInputState } from "./StringListInput";
export type { PureStringListInputProps };
export type { StringListInputState } from "./StringListInput";
