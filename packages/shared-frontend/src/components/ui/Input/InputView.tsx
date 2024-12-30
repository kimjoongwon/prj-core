import { Input, InputProps } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

export const InputView = observer((props: InputProps) => {
  return <Input {...props} fullWidth />;
});
