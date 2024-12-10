import { Button as NextUIButton } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { ButtonViewProps } from '.';

export const ButtonView = observer((props: ButtonViewProps) => {
  const { children, onClick, className = '', size, ...rest } = props;
  return (
    <>
      <NextUIButton
        className={'font-pretendard ' + className}
        onClick={onClick}
        {...rest}
      >
        {children}
      </NextUIButton>
    </>
  );
});
