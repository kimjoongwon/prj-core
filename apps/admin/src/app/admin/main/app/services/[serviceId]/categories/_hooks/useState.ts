import { DataGridState, GetCategoriesByQueryParams } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  const state = useLocalObservable<DataGridState<GetCategoriesByQueryParams>>(
    () => ({
      query: {
        take: 10,
        skip: 0,
      },
    }),
  );

  return state;
};
