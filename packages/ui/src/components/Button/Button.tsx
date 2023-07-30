import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

function _Button(props: ButtonProps) {
  const { children, ...rest } = props;
  return <NextUIButton {...rest}>{children}</NextUIButton>;
}

export const Button = observer(_Button);
