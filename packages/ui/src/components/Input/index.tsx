'use clinet';

import { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { BaseInput, InputProps } from './Input';

const DynamicInput = dynamic(
  () =>
    import('./Input').then(mod => {
      return observer(forwardRef(mod.BaseInput));
    }),
  {
    loading() {
      return <Skeleton className="w-full h-14" />;
    },
    ssr: false,
  },
);

const Input = DynamicInput as <T extends object>(
  props: InputProps<T>,
) => ReturnType<typeof BaseInput>;

export default Input;
