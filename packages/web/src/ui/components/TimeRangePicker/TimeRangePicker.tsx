import dayjs from 'dayjs';
import { get } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useMobxHookForm } from '../../../hooks/useMobxHookForm';
import { MobxProps } from '../../../model';
import { FormControl } from '../controls';

interface TimeRangePickerProps<T> extends MobxProps<T> {
  startTimePath?: string;
  endTimePath?: string;
  baseDate?: Date;
}

export const TimeRangePicker = observer(<T extends object>(props: TimeRangePickerProps<T>) => {
  const { baseDate = new Date(), startTimePath = '', endTimePath = '', state = {} } = props;

  const initialStartTime = get(state, startTimePath) || baseDate;
  const initialEndTime = get(state, endTimePath) || baseDate;

  const localState = useLocalObservable(() => ({
    errorMessage: '',
  }));

  const getBaseDateTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    baseDate.setHours(hours);
    baseDate.setMinutes(minutes);
    return baseDate;
  };

  const { localState: localStartTimeState } = useMobxHookForm(initialStartTime, state, startTimePath);
  const { localState: localEndTimeState } = useMobxHookForm(initialEndTime, state, endTimePath);

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(dayjs(getBaseDateTime(event.target.value)).valueOf());
    console.log(dayjs(localEndTimeState.value).valueOf());
    if (dayjs(getBaseDateTime(event.target.value)).isAfter(localEndTimeState.value)) {
      localState.errorMessage = '시작시간이 종료시간보다 늦을 수 없습니다.';
    } else {
      const baseDateTime = getBaseDateTime(event.target.value);
      localState.errorMessage = '';
      localStartTimeState.value = baseDateTime;
    }
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (dayjs(getBaseDateTime(event.target.value)).isBefore(localStartTimeState.value)) {
      localState.errorMessage = '종료시간이 시작시간보다 빠를 수 없습니다.';
    } else {
      const baseDateTime = getBaseDateTime(event.target.value);
      localState.errorMessage = ' ';
      localEndTimeState.value = baseDateTime;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4">
        <FormControl label="시작시간">
          <input
            type="time"
            onChange={handleStartTimeChange}
            value={dayjs(localStartTimeState.value).format('HH:mm')}
          />
        </FormControl>
        <FormControl label="종료시간">
          <input type="time" onChange={handleEndTimeChange} value={dayjs(localEndTimeState.value).format('HH:mm')} />
        </FormControl>
      </div>
      <p className={`h5 ${localState.errorMessage ? 'text-red-500' : ''}`}>{localState.errorMessage || ''}</p>
    </div>
  );
});
