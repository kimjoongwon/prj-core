import { Button as NextUIButton } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { ButtonViewProps } from '.';

export const ButtonView = observer((props: ButtonViewProps) => {
  const { children, onPress, className = '', size, ...rest } = props;
  return (
    <>
      <NextUIButton
        className={'font-pretendard ' + className}
        onPress={onPress}
        {...rest}
      >
        {children}
      </NextUIButton>
    </>
  );
});
