import { Input, InputProps } from '@heroui/react';
import { observer } from 'mobx-react-lite';

export const InputView = observer((props: InputProps) => {
  return <Input {...props} />;
});
