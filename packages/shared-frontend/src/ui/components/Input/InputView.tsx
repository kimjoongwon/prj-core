import { ForwardedRef, forwardRef } from 'react';
import { Input, InputProps } from '@nextui-org/react';

export const InputView = forwardRef(
  (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return <Input ref={ref} {...props} />;
  },
);
