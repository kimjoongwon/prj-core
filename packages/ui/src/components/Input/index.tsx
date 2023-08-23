import { forwardRef } from 'react';
import { observer } from 'mobx-react-lite';
import { BaseInput, InputProps } from './Input';

type ClickableListWithRefProps<T> = InputProps<T> & {
  ref?: React.Ref<HTMLInputElement>;
};

export const BaseInputWithRef = observer(forwardRef(BaseInput));

export function Input<T extends object>({
  ref,
  ...rest
}: ClickableListWithRefProps<T>) {
  return <BaseInput ref={ref} {...rest} />;
}
