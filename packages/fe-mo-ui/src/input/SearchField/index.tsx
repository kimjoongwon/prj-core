import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
  SearchField as HeroSearchField,
  searchFieldClassNames,
  useSearchField,
} from "heroui-native/search-field";
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
export interface PureSearchFieldProps extends Omit<
  HeroSearchFieldProps,
  "children"
> {
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
    { children, clearButtonProps, inputProps, searchIconProps, ...rest },
    ref,
  ) => (
    <HeroSearchField {...rest} ref={ref}>
      {children ?? (
        <HeroSearchField.Group>
          <HeroSearchField.SearchIcon {...searchIconProps} key="icon" />
          <HeroSearchField.Input {...inputProps} key="input" />
          <HeroSearchField.ClearButton {...clearButtonProps} key="clear" />
        </HeroSearchField.Group>
      )}
    </HeroSearchField>
  ),
);
PureSearchFieldComponent.displayName = "PureSearchField";
export interface SearchFieldProps<
  TState extends object = Record<string, unknown>,
>
  extends MobxProps<TState>, Omit<PureSearchFieldProps, "onChange" | "value"> {}
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
  Group: HeroSearchField.Group,
  Input: HeroSearchField.Input,
  SearchIcon: HeroSearchField.SearchIcon,
}) as typeof SearchFieldComponent &
  Pick<
    typeof HeroSearchField,
    "ClearButton" | "Group" | "Input" | "SearchIcon"
  >;
export { searchFieldClassNames, useSearchField };
