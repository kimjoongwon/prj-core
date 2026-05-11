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
  Select as HeroSelect,
  selectClassNames,
  useSelect,
  useSelectAnimation,
  useSelectItem,
} from "heroui-native/select";
type HeroSelectProps = ComponentPropsWithoutRef<typeof HeroSelect>;
type HeroSelectCloseProps = ComponentPropsWithoutRef<typeof HeroSelect.Close>;
export interface SelectOption {
  description?: ReactNode;
  isDisabled?: boolean;
  label: string;
  value: string;
}
export interface PureSelectProps extends Omit<
  HeroSelectProps,
  "children" | "onValueChange" | "value"
> {
  children?: ReactNode;
  closeProps?: HeroSelectCloseProps;
  listLabel?: ReactNode;
  onChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  value?: string;
}
function toHeroSelectValue(option?: SelectOption) {
  if (!option) {
    return undefined;
  }
  return {
    label: option.label,
    value: option.value,
  };
}
const PureSelectComponent = forwardRef<
  ComponentRef<typeof HeroSelect>,
  PureSelectProps
>(
  (
    {
      children,
      closeProps,
      listLabel,
      onChange,
      options = [],
      placeholder = "Select an option",
      presentation = "popover",
      value,
      ...rest
    },
    ref,
  ) => {
    const selectedOption = options.find((option) => option.value === value);
    const handleValueChange: NonNullable<HeroSelectProps["onValueChange"]> = (
      nextValue:
        | Array<
            | {
                label: string;
                value: string;
              }
            | undefined
          >
        | {
            label: string;
            value: string;
          }
        | undefined,
    ) => {
      if (Array.isArray(nextValue)) {
        onChange?.(nextValue[0]?.value ?? "");
        return;
      }
      onChange?.(nextValue?.value ?? "");
    };
    const contentChildren = [
      listLabel ? (
        <HeroSelect.ListLabel key="list-label">
          {listLabel}
        </HeroSelect.ListLabel>
      ) : null,
      ...options.map((option) => (
        <HeroSelect.Item
          disabled={option.isDisabled}
          key={option.value}
          label={option.label}
          value={option.value}
        >
          <HeroSelect.ItemLabel key={`${option.value}-label`} />
          {option.description ? (
            <HeroSelect.ItemDescription key={`${option.value}-description`}>
              {option.description}
            </HeroSelect.ItemDescription>
          ) : null}
          <HeroSelect.ItemIndicator key={`${option.value}-indicator`} />
        </HeroSelect.Item>
      )),
      closeProps ? <HeroSelect.Close key="close" {...closeProps} /> : null,
    ].filter(Boolean) as ReactNode[];
    const defaultChildren = [
      <HeroSelect.Trigger key="trigger">
        <HeroSelect.Value key="value" placeholder={placeholder} />
        <HeroSelect.TriggerIndicator key="indicator" />
      </HeroSelect.Trigger>,
      <HeroSelect.Portal
        children={[
          <HeroSelect.Overlay key="overlay" />,
          <HeroSelect.Content key="content" presentation={presentation}>
            {contentChildren}
          </HeroSelect.Content>,
        ]}
        key="portal"
      />,
    ];
    return (
      <HeroSelect
        {...rest}
        onValueChange={handleValueChange}
        presentation={presentation}
        ref={ref}
        value={toHeroSelectValue(selectedOption)}
      >
        {children ?? defaultChildren}
      </HeroSelect>
    );
  },
);
PureSelectComponent.displayName = "PureSelect";
export interface SelectProps<TState extends object = Record<string, unknown>>
  extends MobxProps<TState>, Omit<PureSelectProps, "onChange" | "value"> {}
const SelectComponent = observer(
  <TState extends object>(props: SelectProps<TState>) => {
    const { options = [], path, state, ...rest } = props;
    const fallback = options[0]?.value ?? "";
    const field = useFormField<TState, string>({
      path,
      state,
      value: (tools.get(state, path) ?? fallback) as string,
    });
    return (
      <PureSelectComponent
        {...rest}
        onChange={field.setValue}
        options={options}
        value={field.state.value}
      />
    );
  },
);
SelectComponent.displayName = "Select";
export const Select = Object.assign(SelectComponent, {
  Close: HeroSelect.Close,
  Content: HeroSelect.Content,
  Item: HeroSelect.Item,
  ItemDescription: HeroSelect.ItemDescription,
  ItemIndicator: HeroSelect.ItemIndicator,
  ItemLabel: HeroSelect.ItemLabel,
  ListLabel: HeroSelect.ListLabel,
  Overlay: HeroSelect.Overlay,
  Portal: HeroSelect.Portal,
  Trigger: HeroSelect.Trigger,
  TriggerIndicator: HeroSelect.TriggerIndicator,
  Value: HeroSelect.Value,
}) as typeof SelectComponent &
  Pick<
    typeof HeroSelect,
    | "Close"
    | "Content"
    | "Item"
    | "ItemDescription"
    | "ItemIndicator"
    | "ItemLabel"
    | "ListLabel"
    | "Overlay"
    | "Portal"
    | "Trigger"
    | "TriggerIndicator"
    | "Value"
  >;
export { selectClassNames, useSelect, useSelectAnimation, useSelectItem };
