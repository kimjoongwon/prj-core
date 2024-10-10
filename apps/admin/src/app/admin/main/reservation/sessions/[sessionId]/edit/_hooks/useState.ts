import { UpdateSessionDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';
import dayjs from 'dayjs';
import { SessionFormProps } from '@shared/frontend/src/components/forms/Session/types';
import { defaults } from 'lodash-es';

type Form = Omit<SessionFormProps['state'], 'id'>;

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    data: { getSession },
  } = props;

  const defaultForm: Form = {
    name: '',
    recurringDayOfTheWeek: [],
    repeatCycle: 0,
    repeatCycleType: 'DAY',
    tenancyId: '',
    tenantId: '',
    timelineDates: [],
    type: 'ONE_TIME',
    oneTimeDate: dayjs().toISOString(),
    baseDate: null,
    endDate: null,
    local: {
      rangeMode: false,
      oneTImeDate: undefined,
      oneTimeStartDate: undefined,
      oneTimeEndDate: undefined,
    },
  };

  const form = defaults(defaultForm, getSession.data?.data!);

  const state = useLocalObservable<{
    form: Form;
  }>(() => ({
    form,
  }));

  return state;
};
