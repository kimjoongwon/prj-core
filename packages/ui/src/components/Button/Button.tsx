import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';

export function BaseButton(props: ButtonProps) {
  const { children, ...rest } = props;

  return <NextUIButton {...rest}>{children}</NextUIButton>;
}
