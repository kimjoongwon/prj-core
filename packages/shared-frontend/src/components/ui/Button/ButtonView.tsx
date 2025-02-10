import { Button as NextUIButton } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { ButtonViewProps } from '.';

export const ButtonView = observer((props: ButtonViewProps) => {
  const { children, onPress, ...rest } = props;
  return (
    <NextUIButton onPress={onPress} {...rest}>
      {children}
    </NextUIButton>
  );
});
