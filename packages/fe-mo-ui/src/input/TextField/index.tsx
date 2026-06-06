import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { Description as HeroDescription } from "../Description";
import { descriptionClassNames } from "../Description";
import { FieldError as HeroFieldError } from "../FieldError";
import { fieldErrorClassNames } from "../FieldError";
import { InputGroup as HeroInputGroup } from "../InputGroup";
import { inputGroupClassNames } from "../InputGroup";
import { Label as HeroLabel } from "../Label";
import { labelClassNames } from "../Label";
import {
  TextField as HeroTextField,
  textFieldClassNames,
  useTextField,
} from "heroui-native/text-field";
import { Input } from "../Input";
import { Textarea } from "../Textarea";

type HeroTextFieldProps = ComponentPropsWithoutRef<typeof HeroTextField>;

export type TextFieldProps = HeroTextFieldProps & {};

const TextFieldComponent = forwardRef<
  ComponentRef<typeof HeroTextField>,
  TextFieldProps
>((props, ref) => <HeroTextField {...props} ref={ref} />);
TextFieldComponent.displayName = "TextField";

export const TextField = Object.assign(TextFieldComponent, {
  Description: HeroDescription,
  Error: HeroFieldError,
  FieldError: HeroFieldError,
  Group: HeroInputGroup,
  Input,
  InputGroup: HeroInputGroup,
  Label: HeroLabel,
  Textarea,
}) as typeof TextFieldComponent & {
  Description: typeof HeroDescription;
  Error: typeof HeroFieldError;
  FieldError: typeof HeroFieldError;
  Group: typeof HeroInputGroup;
  Input: typeof Input;
  InputGroup: typeof HeroInputGroup;
  Label: typeof HeroLabel;
  Textarea: typeof Textarea;
};

export const Label = HeroLabel;
export const Description = HeroDescription;
export const FieldError = HeroFieldError;
export const InputGroup = HeroInputGroup;

export {
  descriptionClassNames,
  fieldErrorClassNames,
  inputGroupClassNames,
  labelClassNames,
  textFieldClassNames,
  useTextField,
};
