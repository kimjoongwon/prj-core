import dayjs from 'dayjs';
import { get } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useMobxHookForm } from '../../hooks/useMobxHookForm';
import { MobxProps } from '../../types';
import { FormControl } from '../controls';

interface TimeRangePickerProps<T> extends MobxProps<T> {
  startTimePath?: string;
  endTimePath?: string;
}

export const TimeRangePicker = observer(<T extends object>(props: TimeRangePickerProps<T>) => {
  const { startTimePath = '', endTimePath = '', state = {} } = props;

  const initialStartTime = get(state, startTimePath) || dayjs().format('HH:mm');
  const initialEndTime = get(state, endTimePath) || dayjs().format('HH:mm');

  const localState = useLocalObservable(() => ({
    errorMessage: '',
  }));

  const { localState: localStartTimeState } = useMobxHookForm(initialStartTime, state, startTimePath);
  const { localState: localEndTimeState } = useMobxHookForm(initialEndTime, state, endTimePath);

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value > localEndTimeState.value) {
      localState.errorMessage = '시작시간이 종료시간보다 늦을 수 없습니다.';
    } else {
      localState.errorMessage = '';
      localStartTimeState.value = event.target.value;
    }
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value < localStartTimeState.value) {
      localState.errorMessage = '종료시간이 시작시간보다 빠를 수 없습니다.';
    } else {
      localState.errorMessage = ' ';
      localEndTimeState.value = event.target.value;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4">
        <FormControl label="시작시간">
          <input type="time" onChange={handleStartTimeChange} value={localStartTimeState.value} />
        </FormControl>
        <FormControl label="종료시간">
          <input type="time" onChange={handleEndTimeChange} value={localEndTimeState.value} />
        </FormControl>
      </div>
      <p className={`h5 ${localState.errorMessage ? 'text-red-500' : ''}`}>{localState.errorMessage || ''}</p>
    </div>
  );
});
