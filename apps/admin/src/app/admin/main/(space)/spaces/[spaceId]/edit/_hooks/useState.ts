import { CreateSpaceDto, UpdateSpaceDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    context: { isEditMode },
    data: { getSpace },
  } = props;

  const form = isEditMode ? getSpace.data?.data! : { name: '' };

  const state = useLocalObservable<{
    form: CreateSpaceDto | UpdateSpaceDto;
  }>(() => ({
    form,
  }));

  return state;
};
