import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
	type ReactNode,
} from "react";
import { observer } from "mobx-react-lite";
import {
	SearchField as HeroSearchField,
	searchFieldClassNames,
	useSearchField,
} from "heroui-native/search-field";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

type HeroSearchFieldProps = ComponentPropsWithoutRef<typeof HeroSearchField>;
type SearchFieldClearButtonProps = ComponentPropsWithoutRef<
	typeof HeroSearchField.ClearButton
>;
type SearchFieldInputProps = ComponentPropsWithoutRef<typeof HeroSearchField.Input>;
type SearchFieldSearchIconProps = ComponentPropsWithoutRef<
	typeof HeroSearchField.SearchIcon
>;

export interface PureSearchFieldProps
	extends Omit<HeroSearchFieldProps, "children"> {
	children?: ReactNode;
	clearButtonProps?: SearchFieldClearButtonProps;
	inputProps?: SearchFieldInputProps;
	searchIconProps?: SearchFieldSearchIconProps;
}

const PureSearchFieldComponent = forwardRef<
	ElementRef<typeof HeroSearchField>,
	PureSearchFieldProps
>(({ children, clearButtonProps, inputProps, searchIconProps, ...rest }, ref) =>
	createElement(
		HeroSearchField,
		{
			...rest,
			ref,
		},
		children ??
			createElement(HeroSearchField.Group, null, [
				createElement(HeroSearchField.SearchIcon, {
					...searchIconProps,
					key: "icon",
				}),
				createElement(HeroSearchField.Input, {
					...inputProps,
					key: "input",
				}),
				createElement(HeroSearchField.ClearButton, {
					...clearButtonProps,
					key: "clear",
				}),
			]),
	),
);

PureSearchFieldComponent.displayName = "PureSearchField";

export interface SearchFieldProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureSearchFieldProps, "onChange" | "value"> {}

const SearchFieldComponent = observer(
	<TState extends object>(props: SearchFieldProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useMobxField({ fallback: "", path, state });

		return createElement(PureSearchFieldComponent, {
			...rest,
			onChange: field.setValue,
			value: field.value,
		});
	},
);

SearchFieldComponent.displayName = "SearchField";

export const SearchField = Object.assign(SearchFieldComponent, {
	ClearButton: HeroSearchField.ClearButton,
	Group: HeroSearchField.Group,
	Input: HeroSearchField.Input,
	SearchIcon: HeroSearchField.SearchIcon,
}) as typeof SearchFieldComponent &
	Pick<typeof HeroSearchField, "ClearButton" | "Group" | "Input" | "SearchIcon">;

export { searchFieldClassNames, useSearchField };
