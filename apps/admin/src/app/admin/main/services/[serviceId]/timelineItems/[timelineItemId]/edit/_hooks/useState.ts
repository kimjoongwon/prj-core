import { CreateTimelineItemDto, UpdateTimelineItemDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    context: { isEditMode },
    data: { getTimelineItem },
  } = props;

  const defaultForm: CreateTimelineItemDto = {
    address: '',
    description: '',
    endDateTime: '',
    maxCapacity: 0,
    minCapacity: 0,
    startDateTime: '',
    tenantId: '',
    timelineId: '',
    title: '',
  };

  const form = isEditMode ? getTimelineItem.data?.data! : defaultForm;

  const state = useLocalObservable<{
    form: CreateTimelineItemDto | UpdateTimelineItemDto;
  }>(() => ({
    form,
  }));

  return state;
};
