import { observer } from 'mobx-react-lite';
import { MobxProps } from '../../../model';
import { useMobxHookForm } from '../../../hooks';
import dayjs from 'dayjs';
import { get } from 'lodash-es';

interface TimePickerProps<T> extends MobxProps<T> {}

export const TimePicker = observer(<T extends object>(props: TimePickerProps<T>) => {
  const { path = '', state = {} } = props;

  const initialValues = get(state, path) || dayjs().format('HH:mm');

  const { localState } = useMobxHookForm(initialValues, state, path);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = event.target.value;
  };

  return <input type="time" onChange={handleChange} value={localState.value} />;
});
