import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';

export function BaseButton(props: ButtonProps) {
  const { children, onClick, ...rest } = props;

  return (
    <>
      <NextUIButton onClick={onClick} size="sm" {...rest}>
        {children}
      </NextUIButton>
    </>
  );
}
