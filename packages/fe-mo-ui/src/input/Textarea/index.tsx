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
import { Description as HeroDescription } from "../Description";
import { descriptionClassNames } from "../Description";
import { FieldError as HeroFieldError } from "../FieldError";
import { fieldErrorClassNames } from "../FieldError";
import { Label as HeroLabel } from "../Label";
import {
  TextArea as HeroTextArea,
  textAreaClassNames,
} from "heroui-native/text-area";
import { TextField as HeroTextField } from "heroui-native/text-field";
type HeroTextAreaProps = ComponentPropsWithoutRef<typeof HeroTextArea>;
interface TextareaFieldProps {
  description?: ReactNode;
  errorMessage?: ReactNode;
  helperText?: ReactNode;
  isRequired?: boolean;
  label?: ReactNode;
}
export interface PureTextareaProps extends Omit<
  HeroTextAreaProps,
  | "onBlur"
  | "onChange"
  | "onChangeText"
  | "value"
  | keyof TextareaFieldProps
>, TextareaFieldProps {
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
  value?: string;
}
const PureTextareaComponent = forwardRef<
  ComponentRef<typeof HeroTextArea>,
  PureTextareaProps
>(
  (
    {
      description,
      errorMessage,
      helperText,
      isDisabled,
      isInvalid,
      isRequired,
      label,
      onBlur,
      onChange,
      value = "",
      ...rest
    },
    ref,
  ) => {
    const resolvedInvalid = Boolean(isInvalid || errorMessage);
    const hasTextField = Boolean(
      label || description || helperText || errorMessage || isRequired,
    );
    const textarea = (
      <HeroTextArea
        {...rest}
        isDisabled={isDisabled}
        isInvalid={resolvedInvalid}
        onBlur={() => {
          onBlur?.(value);
        }}
        onChangeText={onChange}
        ref={ref}
        value={value}
      />
    );

    if (!hasTextField) {
      return textarea;
    }

    return (
      <HeroTextField
        isDisabled={isDisabled}
        isInvalid={resolvedInvalid}
        isRequired={isRequired}
      >
        {label && <HeroLabel>{label}</HeroLabel>}
        {textarea}
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
PureTextareaComponent.displayName = "PureTextarea";
export interface TextareaProps<TState extends object = Record<string, unknown>>
  extends
    MobxProps<TState>,
    Omit<PureTextareaProps, "onBlur" | "onChange" | "value"> {}
const TextareaComponent = observer(
  <TState extends object>(props: TextareaProps<TState>) => {
    const { path, state, ...rest } = props;
    const field = useFormField<TState, string>({
      path,
      state,
      value: (tools.get(state, path) ?? "") as string,
    });
    return (
      <PureTextareaComponent
        {...rest}
        onBlur={field.setValue}
        onChange={field.setValue}
        value={field.state.value}
      />
    );
  },
);
TextareaComponent.displayName = "Textarea";
export const Textarea = Object.assign(TextareaComponent, {
  Description: HeroDescription,
  Error: HeroFieldError,
  FieldError: HeroFieldError,
  Label: HeroLabel,
}) as typeof TextareaComponent & {
  Description: typeof HeroDescription;
  Error: typeof HeroFieldError;
  FieldError: typeof HeroFieldError;
  Label: typeof HeroLabel;
};
export const TextArea = Textarea;
export { textAreaClassNames };
