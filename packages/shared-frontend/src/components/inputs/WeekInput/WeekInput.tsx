

import { WeekInputView } from './WeekInputView';
import { get } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { useMobxHookForm } from '../../../..';
import { RecurringDayOfTheWeek } from '@shared/types';

export const WeekInput = observer((props: any) => {
  const { state, path, ...rest } = props;
  const initialValue = get(state, path);
  const { localState } = useMobxHookForm(initialValue, state, path);

  const onChange = (value: RecurringDayOfTheWeek) => {
    localState.value = value;
  };

  return (
    <WeekInputView {...rest} onChange={onChange} value={localState.value} />
  );
});
