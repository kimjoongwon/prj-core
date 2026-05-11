import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
  InputOTP as HeroInputOTP,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  inputOTPClassNames,
  useInputOTP,
} from "heroui-native/input-otp";
type HeroInputOTPProps = ComponentPropsWithoutRef<typeof HeroInputOTP>;
export interface PureInputOTPProps extends Omit<
  HeroInputOTPProps,
  "onChange" | "value"
> {
  onChange?: (value: string) => void;
  value?: string;
}
const PureInputOTPComponent = forwardRef<
  ComponentRef<typeof HeroInputOTP>,
  PureInputOTPProps
>(({ children, maxLength, onChange, value, ...rest }, ref) => (
  <HeroInputOTP
    {...rest}
    maxLength={maxLength}
    onChange={onChange}
    ref={ref}
    value={value}
  >
    {children ?? (
      <HeroInputOTP.Group>
        {Array.from(
          {
            length: maxLength,
          },
          (_, index) => (
            <HeroInputOTP.Slot index={index} key={index} />
          ),
        )}
      </HeroInputOTP.Group>
    )}
  </HeroInputOTP>
));
PureInputOTPComponent.displayName = "PureInputOTP";
export interface InputOTPProps<TState extends object = Record<string, unknown>>
  extends MobxProps<TState>, Omit<PureInputOTPProps, "onChange" | "value"> {}
const InputOTPComponent = observer(
  <TState extends object>(props: InputOTPProps<TState>) => {
    const { path, state, ...rest } = props;
    const field = useFormField<TState, string>({
      path,
      state,
      value: (tools.get(state, path) ?? "") as string,
    });
    return (
      <PureInputOTPComponent
        {...rest}
        onChange={field.setValue}
        value={field.state.value}
      />
    );
  },
);
InputOTPComponent.displayName = "InputOTP";
export const InputOTP = Object.assign(InputOTPComponent, {
  Group: HeroInputOTP.Group,
  Separator: HeroInputOTP.Separator,
  Slot: HeroInputOTP.Slot,
  SlotCaret: HeroInputOTP.SlotCaret,
  SlotPlaceholder: HeroInputOTP.SlotPlaceholder,
  SlotValue: HeroInputOTP.SlotValue,
}) as typeof InputOTPComponent &
  Pick<
    typeof HeroInputOTP,
    | "Group"
    | "Separator"
    | "Slot"
    | "SlotCaret"
    | "SlotPlaceholder"
    | "SlotValue"
  >;
export {
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  inputOTPClassNames,
  useInputOTP,
};
