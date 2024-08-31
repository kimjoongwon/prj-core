import {
  CreateTimelineItemDto,
  galaxy,
  UpdateTimelineItemDto,
} from '@shared/frontend';
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
    data: { getTimelineItem },
  } = props;

  const defaultForm: CreateTimelineItemDto = {
    address: '강남구 논현동 교보문구 빌딩 지하 2층',
    description: '유산소 운동',
    endDateTime: dayjs().add(1, 'hour').toISOString(),
    maxCapacity: 30,
    minCapacity: 10,
    startDateTime: dayjs().add(4, 'hour').toISOString(),
    tenantId: galaxy.auth.tenant?.id || '',
    title: '인듀어런스',
  };

  const form = isEditMode ? getTimelineItem.data?.data! : defaultForm;

  const state = useLocalObservable<{
    form: CreateTimelineItemDto | UpdateTimelineItemDto;
  }>(() => ({
    form,
  }));

  return state;
};
