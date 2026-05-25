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
import { Description as HeroDescription } from "heroui-native/description";
import { FieldError as HeroFieldError } from "heroui-native/field-error";
import {
  InputOTP as HeroInputOTP,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  inputOTPClassNames,
  useInputOTP,
} from "heroui-native/input-otp";
import { Label as HeroLabel } from "heroui-native/label";
import { TextField as HeroTextField } from "heroui-native/text-field";
type HeroInputOTPProps = ComponentPropsWithoutRef<typeof HeroInputOTP>;
interface InputOTPFieldProps {
  description?: ReactNode;
  errorMessage?: ReactNode;
  helperText?: ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  label?: ReactNode;
}
export interface PureInputOTPProps extends Omit<
  HeroInputOTPProps,
  "maxLength" | "onChange" | "value" | keyof InputOTPFieldProps
>, InputOTPFieldProps {
  maxLength?: number;
  onChange?: (value: string) => void;
  value?: string;
}
const PureInputOTPComponent = forwardRef<
  ComponentRef<typeof HeroInputOTP>,
  PureInputOTPProps
>(
  (
    {
      children,
      description,
      errorMessage,
      helperText,
      isInvalid,
      isRequired,
      label,
      maxLength = 6,
      onChange,
      value,
      ...rest
    },
    ref,
  ) => {
    const resolvedInvalid = Boolean(isInvalid || errorMessage);
    const hasTextField = Boolean(
      label || description || helperText || errorMessage || isRequired,
    );
    const inputOTP = (
      <HeroInputOTP
        {...rest}
        isInvalid={resolvedInvalid}
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
    );

    if (!hasTextField) {
      return inputOTP;
    }

    return (
      <HeroTextField
        isInvalid={resolvedInvalid}
        isRequired={isRequired}
      >
        {label && <HeroLabel>{label}</HeroLabel>}
        {inputOTP}
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
      </HeroTextField>
    );
  },
);
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
  Description: HeroDescription,
  Error: HeroFieldError,
  FieldError: HeroFieldError,
  Group: HeroInputOTP.Group,
  Label: HeroLabel,
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
  > & {
    Description: typeof HeroDescription;
    Error: typeof HeroFieldError;
    FieldError: typeof HeroFieldError;
    Label: typeof HeroLabel;
  };
export {
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  inputOTPClassNames,
  useInputOTP,
};
