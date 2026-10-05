"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureSearchField,
	type PureSearchFieldProps,
	searchFieldClassNames,
	useSearchField,
} from "./SearchField";

export interface SearchFieldProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<PureSearchFieldProps, "onChange" | "value"> {}

const SearchField = observer(
	<TState extends object>(props: SearchFieldProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, string>({
			path,
			state,
			value: (tools.get(state, path) ?? "") as string,
		});

		return (
			<PureSearchField
				{...rest}
				onChange={field.setValue}
				value={field.state.value}
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
