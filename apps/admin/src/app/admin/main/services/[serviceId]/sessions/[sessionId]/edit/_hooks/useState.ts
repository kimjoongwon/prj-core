import { CreateSessionDto, galaxy, UpdateSessionDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';
import dayjs from 'dayjs';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    context: { isEditMode },
    data: { getSession },
  } = props;

  const defaultForm: CreateSessionDto = {
    endAfterOccurrences: null,
    endOnDate: null,
    endType: 'NEVER',
    name: '',
    recurringDayOfTheWeek: [],
    repeatCycle: 0,
    repeatCycleType: 'DAY',
    tenancyId: '',
    tenantId: '',
    timelineDates: '',
    type: 'ONE_TIME',
  };

  const form = isEditMode ? getSession.data?.data! : defaultForm;

  const state = useLocalObservable<{
    form: CreateSessionDto | UpdateSessionDto;
  }>(() => ({
    form,
  }));

  return state;
};
