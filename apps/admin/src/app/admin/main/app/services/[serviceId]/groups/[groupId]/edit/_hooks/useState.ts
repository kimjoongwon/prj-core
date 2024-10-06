import { CreateGroupDto, UpdateGroupDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useData } from './useData';
import { useContext } from './useContext';

export const useState = (props: {
  data: ReturnType<typeof useData>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    data: { getGroup },
    context: { isEditMode },
  } = props;

  const state = useLocalObservable<{ form: UpdateGroupDto | CreateGroupDto }>(
    () => ({
      form: isEditMode
        ? {
            ...getGroup.data?.data,
          }
        : {
            name: '',
            spaceId: 'ss',
            serviceId: 'ss',
          },
    }),
  );

  return state;
};
