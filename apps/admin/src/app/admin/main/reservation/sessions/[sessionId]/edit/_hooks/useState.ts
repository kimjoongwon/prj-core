import { galaxy, SessionDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';
import { defaults } from 'lodash-es';

export const useState = (props: { queries: ReturnType<typeof useQueries> }) => {
  const {
    queries: { getSessionResponse },
  } = props;

  const defaultForm: Partial<SessionDto> = {
    name: '',
    recurringDayOfTheWeek: [],
    repeatCycle: 0,
    repeatCycleType: 'WEEK',
    tenantId: galaxy.auth.tenant?.id,
    type: 'ONE_TIME',
    startDate: null,
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
