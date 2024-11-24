import { Button as NextUIButton } from '@nextui-org/react';
import { ButtonViewProps } from '@shared/types';
import { observer } from 'mobx-react-lite';

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
