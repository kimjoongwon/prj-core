import { TextAreaProps, Textarea } from '@nextui-org/react';
import { MobxProps } from '../../types';
import { useMobxHookForm } from '../../hooks';
import { get } from 'lodash-es';

export interface BaseTextareaProps<T> extends TextAreaProps, MobxProps<T> {}

export const BaseTextarea = <T extends object>(props: BaseTextareaProps<T>) => {
  const { value, state = {}, path = '', ...rest } = props;
  const initialValue = get(state, path, value);
  const { localState } = useMobxHookForm(initialValue, state, path);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = e.target.value;
  };

  return <Textarea {...rest} value={localState.value} onChange={handleOnChange} />;
};
