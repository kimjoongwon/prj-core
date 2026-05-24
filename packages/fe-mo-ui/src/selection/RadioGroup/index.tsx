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
  RadioGroup as HeroRadioGroup,
  radioGroupClassNames,
  useRadioGroup,
  useRadioGroupItem,
} from "heroui-native/radio-group";
import { getTextContent, Text } from "../../data-display/Text";
import { Radio } from "../Radio";
type HeroRadioGroupProps = ComponentPropsWithoutRef<typeof HeroRadioGroup>;
type HeroRadioGroupItemProps = ComponentPropsWithoutRef<
  typeof HeroRadioGroup.Item
>;
export interface RadioOption {
  description?: string;
  isDisabled?: boolean;
  text: ReactNode;
  value: string;
}
export interface PureRadioGroupProps extends Omit<
  HeroRadioGroupProps,
  "children"
> {
  children?: ReactNode;
  options?: RadioOption[];
}
const PureRadioGroupComponent = forwardRef<
  ComponentRef<typeof HeroRadioGroup>,
  PureRadioGroupProps
>(({ children, options = [], ...rest }, ref) => (
  <HeroRadioGroup {...rest} ref={ref}>
    {children ??
      options.map((option: RadioOption) => {
        const label = getTextContent(option.text);

        return (
          <RadioGroupItem
            isDisabled={option.isDisabled}
            key={option.value}
            value={option.value}
          >
            {label === null ? (
              option.text
            ) : (
              <>
                <Text variant="label">{label}</Text>
                <Radio />
              </>
            )}
          </RadioGroupItem>
        );
      })}
  </HeroRadioGroup>
));
PureRadioGroupComponent.displayName = "PureRadioGroup";
export interface RadioGroupProps<
  TState extends object = Record<string, unknown>,
>
  extends
    MobxProps<TState>,
    Omit<PureRadioGroupProps, "onValueChange" | "value"> {}
const RadioGroupComponent = observer(
  <TState extends object>(props: RadioGroupProps<TState>) => {
    const { options = [], path, state, ...rest } = props;
    const fallback = options[0]?.value ?? "";
    const field = useFormField<TState, string>({
      path,
      state,
      value: (tools.get(state, path) ?? fallback) as string,
    });
    return (
      <PureRadioGroupComponent
        {...rest}
        onValueChange={field.setValue}
        options={options}
        value={field.state.value}
      />
    );
  },
);
RadioGroupComponent.displayName = "RadioGroup";
const RadioGroupItem = forwardRef<
  ComponentRef<typeof HeroRadioGroup.Item>,
  HeroRadioGroupItemProps
>(({ children, ...props }, ref) => {
  const label =
    typeof children === "function" ? null : getTextContent(children);

  return (
    <HeroRadioGroup.Item {...props} ref={ref}>
      {label === null ? (
        children
      ) : (
        <>
          <Text variant="label">{label}</Text>
          <Radio />
        </>
      )}
    </HeroRadioGroup.Item>
  );
});
RadioGroupItem.displayName = "RadioGroup.Item";
export const RadioGroup = Object.assign(RadioGroupComponent, {
  Item: RadioGroupItem,
}) as typeof RadioGroupComponent & {
  Item: typeof RadioGroupItem;
};
export { radioGroupClassNames, useRadioGroup, useRadioGroupItem };
