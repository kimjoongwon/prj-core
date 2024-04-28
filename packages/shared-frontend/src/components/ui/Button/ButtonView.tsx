import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';

export function ButtonView(props: ButtonProps) {
  const { children, onClick, className, size, ...rest } = props;
  return (
    <>
      <NextUIButton
        className={'font-pretendard ' + className}
        onClick={onClick}
        size="sm"
        {...rest}
      >
        {children}
      </NextUIButton>
    </>
  );
}
