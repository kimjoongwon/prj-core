import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';
import { action } from 'mobx';

export function BaseButton(props: ButtonProps) {
  const { children, onClick, ...rest } = props;

  return (
    <NextUIButton color="primary" {...rest} onClick={action(onClick)}>
      {children}
    </NextUIButton>
  );
}
