import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { View } from "react-native";
import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
  Radio as HeroRadio,
  radioClassNames,
  useRadio,
} from "heroui-native";
import { getTextContent, Text } from "../../data-display/Text";
type HeroRadioProps = ComponentPropsWithoutRef<typeof HeroRadio>;
export type PureRadioProps = HeroRadioProps & {};
const PureRadioComponent = forwardRef<
  ComponentRef<typeof HeroRadio>,
  PureRadioProps
>(
  ({ children, ...props }, ref) => {
    const label =
      typeof children === "function" ? null : getTextContent(children);

    if (label === null) {
      return (
        <HeroRadio {...props} ref={ref}>
          {children}
        </HeroRadio>
      );
    }

    return (
      <View className="w-full flex-row items-center gap-3">
        <HeroRadio {...props} ref={ref} />
        <Text className="flex-1" variant="label">
          {label}
        </Text>
      </View>
    );
  },
);
PureRadioComponent.displayName = "PureRadio";
export const PureRadio = Object.assign(
  PureRadioComponent,
  HeroRadio,
) as typeof HeroRadio;
export interface RadioProps<TState extends object = Record<string, unknown>>
  extends MobxProps<TState>,
    Omit<PureRadioProps, "isSelected" | "onSelectedChange"> {}
const RadioComponent = observer(
  <TState extends object>(props: RadioProps<TState>) => {
    const { path, state, ...rest } = props;
    const field = useFormField<TState, boolean>({
      path,
      state,
      value: (tools.get(state, path) ?? false) as boolean,
    });
    return (
      <PureRadioComponent
        {...rest}
        isSelected={Boolean(field.state.value)}
        onSelectedChange={field.setValue}
      />
    );
  },
);
RadioComponent.displayName = "Radio";
export const Radio = Object.assign(
  RadioComponent,
  HeroRadio,
) as typeof RadioComponent & typeof HeroRadio;
export { radioClassNames, useRadio };
