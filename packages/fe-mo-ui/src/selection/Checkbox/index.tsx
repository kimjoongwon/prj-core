import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { View } from "react-native";
import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
  Checkbox as HeroCheckbox,
  checkboxClassNames,
  useCheckbox,
} from "heroui-native/checkbox";
import { getTextContent, Text } from "../../data-display/Text";
import { joinClassNames } from "../../rhythm/class-name";
type HeroCheckboxProps = ComponentPropsWithoutRef<typeof HeroCheckbox>;
export interface PureCheckboxProps extends Omit<
  HeroCheckboxProps,
  "onSelectedChange"
> {
  onChange?: (checked: boolean) => void;
}
const PureCheckboxComponent = forwardRef<
  ComponentRef<typeof HeroCheckbox>,
  PureCheckboxProps
>(({ children, className, onChange, ...rest }, ref) => {
  const label =
    typeof children === "function" ? null : getTextContent(children);

  if (label === null) {
    return (
      <HeroCheckbox
        {...(rest as HeroCheckboxProps)}
        className={className}
        onSelectedChange={onChange}
        ref={ref}
      >
        {children}
      </HeroCheckbox>
    );
  }

  return (
    <HeroCheckbox
      {...(rest as HeroCheckboxProps)}
      className={joinClassNames(
        "h-auto w-full flex-row items-center gap-3 overflow-visible rounded-none bg-transparent shadow-none",
        className,
      )}
      onSelectedChange={onChange}
      ref={ref}
    >
      <View className="relative size-6 overflow-hidden rounded-lg bg-field shadow-field">
        <HeroCheckbox.Indicator />
      </View>
      <Text className="flex-1" variant="label">
        {label}
      </Text>
    </HeroCheckbox>
  );
});
PureCheckboxComponent.displayName = "PureCheckbox";
export interface CheckboxProps<TState extends object = Record<string, unknown>>
  extends
    MobxProps<TState>,
    Omit<PureCheckboxProps, "isSelected" | "onChange"> {}
const CheckboxComponent = observer(
  <TState extends object>(props: CheckboxProps<TState>) => {
    const { path, state, ...rest } = props;
    const field = useFormField<TState, boolean>({
      path,
      state,
      value: (tools.get(state, path) ?? false) as boolean,
    });
    const isSelected = Boolean(field.state.value);
    return (
      <PureCheckboxComponent
        {...rest}
        isSelected={isSelected}
        onChange={field.setValue}
      />
    );
  },
);
CheckboxComponent.displayName = "Checkbox";
export const Checkbox = Object.assign(CheckboxComponent, {
  Indicator: HeroCheckbox.Indicator,
}) as typeof CheckboxComponent & Pick<typeof HeroCheckbox, "Indicator">;
export { checkboxClassNames, useCheckbox };
