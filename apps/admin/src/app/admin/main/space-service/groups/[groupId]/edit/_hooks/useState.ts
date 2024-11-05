import { CreateGroupDto, GroupDto, UpdateGroupDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';
import { useParams } from 'next/navigation';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    data: { getGroup },
    context: { serviceId },
  } = props;

  const form: Partial<GroupDto> = getGroup.data?.data || {
    name: '',
    serviceId,
  };

  const state = useLocalObservable<{ form: Partial<GroupDto> }>(() => ({
    form: form,
  }));

  return state;
};
