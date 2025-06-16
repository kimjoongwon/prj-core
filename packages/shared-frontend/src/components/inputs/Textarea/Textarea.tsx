import { TextAreaProps, Textarea } from '@heroui/react';
import { MobxProps, BaseTextareaProps } from '@shared/types';
import { useMobxHookForm } from '../../../..';
import { get } from 'lodash-es';
import { observer } from 'mobx-react-lite';

export const BaseTextarea = observer(
  <T extends object>(props: BaseTextareaProps<T>) => {
    const { value, state = {}, path = '', ...rest } = props;
    const initialValue = get(state, path, value);
    const { localState } = useMobxHookForm(initialValue, state, path);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      localState.value = e.target.value;
    };

    return (
      <Textarea {...rest} value={localState.value} onChange={handleOnChange} />
    );
  },
);
