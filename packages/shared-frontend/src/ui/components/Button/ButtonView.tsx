import {
  ButtonProps,
  Button as NextUIButton,
} from '@nextui-org/react';

export function ButtonView(props: ButtonProps) {
  const { children, onClick, ...rest } = props;

  return (
    <>
      <NextUIButton onClick={onClick} size="sm" {...rest}>
        {children}
      </NextUIButton>
    </>
  );
}
