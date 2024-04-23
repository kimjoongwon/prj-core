import { ForwardedRef, forwardRef } from 'react';
import { Input, InputProps } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

export const InputView = observer(
  forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return <Input ref={ref} {...props} className="flex flex-1 w-full" />;
  }),
);
