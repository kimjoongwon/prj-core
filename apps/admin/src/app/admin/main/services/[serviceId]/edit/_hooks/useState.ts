import { CreateServiceDto, UpdateServiceDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    context: { isEditMode },
    data: { getService },
  } = props;

  const form = isEditMode
    ? getService.data?.data!
    : { name: undefined, label: '' };

  const state = useLocalObservable<{
    form: CreateServiceDto | UpdateServiceDto;
  }>(() => ({
    form,
  }));

  return state;
};
