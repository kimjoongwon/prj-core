import { forwardRef } from 'react';
import { observer } from 'mobx-react-lite';
import { BaseInput, InputProps } from './Input';

export const Input = observer(forwardRef(BaseInput)) as <T extends object>(
  props: InputProps<T>,
) => ReturnType<typeof BaseInput>;
