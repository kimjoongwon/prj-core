import { ButtonProps, Button as NextUIButton } from '@heroui/react';
import { observer } from 'mobx-react-lite';

export const Button = observer((props: ButtonProps) => {
  const { children, onPress, ...rest } = props;
  return (
    <NextUIButton onPress={onPress} {...rest}>
      {children}
    </NextUIButton>
  );
});
