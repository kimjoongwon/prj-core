"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureSearchField,
	type PureSearchFieldProps,
	searchFieldClassNames,
	useSearchField,
} from "./SearchField";
import { useRegisterInputState } from "../input-state-inspection";

type BoundSearchFieldProps<TState extends object> = MobxProps<TState> &
	(Omit<PureSearchFieldProps, "onChange" | "value"> & {
		value?: never;
		defaultValue?: string;
		onChange?: PureSearchFieldProps["onChange"];
	});
type UnboundSearchFieldProps = Omit<
	PureSearchFieldProps,
	"onChange" | "value"
> & {
	state?: never;
	path?: never;
	value?: string;
	defaultValue?: string;
	onChange?: PureSearchFieldProps["onChange"];
};
export type SearchFieldProps<TState extends object = Record<string, unknown>> =
	| BoundSearchFieldProps<TState>
	| UnboundSearchFieldProps;
export function createSearchFieldState(value = "") {
	const state = {
		value,
		setValue(nextValue: string) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "SearchFieldState" },
	);
}
export type SearchFieldState = ReturnType<typeof createSearchFieldState>;

const SearchField = observer(
	<TState extends object>(props: SearchFieldProps<TState>) => {
		const {
			defaultValue,
			onChange,
			path,
			state,
			value: controlledValue,
			...rest
		} = props;
		const localState = useLocalObservable(() =>
			createSearchFieldState(defaultValue ?? ""),
		);
		const field = useFormField<TState, string>({
			path: (state && path ? path : "value") as Paths<TState, 4>,
			state: (state ?? localState) as TState,
			defaultValue: defaultValue ?? "",
		});
		const isBound = state !== undefined && path !== undefined;
		const isControlled = !isBound && controlledValue !== undefined;
		useRegisterInputState(
			() => (isControlled ? controlledValue : field.state.value),
			isControlled ? controlledValue : field.state.value,
		);

		return (
			<PureSearchField
				{...rest}
				onChange={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onChange?.(nextValue);
				}}
				value={isControlled ? controlledValue : field.state.value}
			/>
		);
	},
);
SearchField.displayName = "SearchField";

const SearchFieldWithStatics = Object.assign(SearchField, {
	ClearButton: PureSearchField.ClearButton,
	Description: PureSearchField.Description,
	Error: PureSearchField.Error,
	FieldError: PureSearchField.FieldError,
	Group: PureSearchField.Group,
	Input: PureSearchField.Input,
	Label: PureSearchField.Label,
	SearchIcon: PureSearchField.SearchIcon,
}) as typeof SearchField &
	Pick<
		typeof PureSearchField,
		"ClearButton" | "Group" | "Input" | "SearchIcon"
	> & {
		Description: typeof PureSearchField.Description;
		Error: typeof PureSearchField.Error;
		FieldError: typeof PureSearchField.FieldError;
		Label: typeof PureSearchField.Label;
	};
export { SearchFieldWithStatics as SearchField };
export { searchFieldClassNames, useSearchField };
export type { PureSearchFieldProps };
