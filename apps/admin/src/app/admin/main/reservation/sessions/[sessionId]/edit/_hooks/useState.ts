import { SessionDto, UpdateSessionDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';
import dayjs from 'dayjs';
import { defaults } from 'lodash-es';
import { SessionFormProps } from '@shared/frontend/src/components/forms/Session/types';

type Form = Omit<SessionFormProps['state'], 'id'>;

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    data: { getSessionResponse },
  } = props;

  const defaultForm: Partial<SessionDto> = {
    name: '',
    recurringDayOfTheWeek: [],
    repeatCycle: 0,
    repeatCycleType: 'DAY',
    tenantId: '',
    type: 'ONE_TIME',
    baseDate: null,
    endDate: null,
  };

  const form = defaults(defaultForm, getSessionResponse?.data);

  const state = useLocalObservable<{
    form: Partial<SessionDto>;
  }>(() => ({
    form,
  }));

  return state;
};
