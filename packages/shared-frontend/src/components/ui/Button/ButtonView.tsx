import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

interface ButtonViewProps extends ButtonProps {
  getDisabled?: () => boolean;
  getLoading?: () => boolean;
}

export const ButtonView = observer((props: ButtonViewProps) => {
  const {
    children,
    onClick,
    className,
    size,
    getDisabled,
    getLoading,
    ...rest
  } = props;
  return (
    <>
      <NextUIButton
        className={'font-pretendard ' + className}
        onClick={onClick}
        isDisabled={getDisabled?.()}
        isLoading={getLoading?.()}
        {...rest}
      >
        {children}
      </NextUIButton>
    </>
  );
});
