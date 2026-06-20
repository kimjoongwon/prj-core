import { type ComponentPropsWithoutRef } from "react";
import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
  ControlField as HeroControlField,
  controlFieldClassNames,
  useControlField,
} from "heroui-native/control-field";

type HeroControlFieldProps = ComponentPropsWithoutRef<
  typeof HeroControlField
>;

export type PureControlFieldProps = HeroControlFieldProps;
export const PureControlField = HeroControlField;

export interface ControlFieldProps<
  TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
    Omit<PureControlFieldProps, "isSelected" | "onSelectedChange"> {}

const ControlFieldComponent = observer(
  <TState extends object>(props: ControlFieldProps<TState>) => {
    const { path, state, ...rest } = props;
    const field = useFormField<TState, boolean>({
      path,
      state,
      value: (tools.get(state, path) ?? false) as boolean,
    });
    return (
      <HeroControlField
        {...rest}
        isSelected={Boolean(field.state.value)}
        onSelectedChange={field.setValue}
      />
    );
  },
);

ControlFieldComponent.displayName = "ControlField";
export const ControlField = Object.assign(
  ControlFieldComponent,
  HeroControlField,
) as typeof ControlFieldComponent & typeof HeroControlField;
export { controlFieldClassNames, useControlField };
export type * from "heroui-native/control-field";
