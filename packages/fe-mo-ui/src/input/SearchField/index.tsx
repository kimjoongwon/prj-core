import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import {
	Description as HeroDescription,
	FieldError as HeroFieldError,
	Label as HeroLabel,
	SearchField as HeroSearchField,
	searchFieldClassNames,
	useSearchField,
} from "heroui-native";
import { observer } from "mobx-react-lite";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";

type HeroSearchFieldProps = ComponentPropsWithoutRef<typeof HeroSearchField>;
type SearchFieldClearButtonProps = ComponentPropsWithoutRef<
	typeof HeroSearchField.ClearButton
>;
type SearchFieldInputProps = ComponentPropsWithoutRef<
	typeof HeroSearchField.Input
>;
type SearchFieldSearchIconProps = ComponentPropsWithoutRef<
	typeof HeroSearchField.SearchIcon
>;
interface SearchFieldCompositionProps {
	description?: ReactNode;
	errorMessage?: ReactNode;
	helperText?: ReactNode;
	label?: ReactNode;
}
export interface PureSearchFieldProps
	extends Omit<
			HeroSearchFieldProps,
			"children" | keyof SearchFieldCompositionProps
		>,
		SearchFieldCompositionProps {
	children?: ReactNode;
	clearButtonProps?: SearchFieldClearButtonProps;
	inputProps?: SearchFieldInputProps;
	searchIconProps?: SearchFieldSearchIconProps;
}
const PureSearchFieldComponent = forwardRef<
	ComponentRef<typeof HeroSearchField>,
	PureSearchFieldProps
>(
	(
		{
			children,
			clearButtonProps,
			description,
			errorMessage,
			helperText,
			inputProps,
			isInvalid,
			label,
			searchIconProps,
			...rest
		},
		ref,
	) => {
		const resolvedInvalid = Boolean(isInvalid || errorMessage);

		return (
			<HeroSearchField {...rest} isInvalid={resolvedInvalid} ref={ref}>
				{children ?? (
					<>
						{label && <HeroLabel>{label}</HeroLabel>}
						<HeroSearchField.Group>
							<HeroSearchField.SearchIcon {...searchIconProps} />
							<HeroSearchField.Input {...inputProps} />
							<HeroSearchField.ClearButton {...clearButtonProps} />
						</HeroSearchField.Group>
						{description && (
							<HeroDescription hideOnInvalid={Boolean(errorMessage)}>
								{description}
							</HeroDescription>
						)}
						{helperText && (
							<HeroDescription hideOnInvalid={Boolean(errorMessage)}>
								{helperText}
							</HeroDescription>
						)}
						{errorMessage && <HeroFieldError>{errorMessage}</HeroFieldError>}
					</>
				)}
			</HeroSearchField>
		);
	},
);
PureSearchFieldComponent.displayName = "PureSearchField";
export interface SearchFieldProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<PureSearchFieldProps, "onChange" | "value"> {}
const SearchFieldComponent = observer(
	<TState extends object>(props: SearchFieldProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, string>({
			path,
			state,
			value: (tools.get(state, path) ?? "") as string,
		});
		return (
			<PureSearchFieldComponent
				{...rest}
				onChange={field.setValue}
				value={field.state.value}
			/>
		);
	},
);
SearchFieldComponent.displayName = "SearchField";
export const SearchField = Object.assign(SearchFieldComponent, {
	ClearButton: HeroSearchField.ClearButton,
	Description: HeroDescription,
	Error: HeroFieldError,
	FieldError: HeroFieldError,
	Group: HeroSearchField.Group,
	Input: HeroSearchField.Input,
	Label: HeroLabel,
	SearchIcon: HeroSearchField.SearchIcon,
}) as typeof SearchFieldComponent &
	Pick<
		typeof HeroSearchField,
		"ClearButton" | "Group" | "Input" | "SearchIcon"
	> & {
		Description: typeof HeroDescription;
		Error: typeof HeroFieldError;
		FieldError: typeof HeroFieldError;
		Label: typeof HeroLabel;
	};
export { searchFieldClassNames, useSearchField };
