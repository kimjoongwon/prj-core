import { CategoryDto, CreateCategoryDto } from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = (props: ReturnType<typeof useQueries>) => {
  const { category } = props;

  return useLocalObservable<{
    category: CategoryDto | undefined | CreateCategoryDto;
  }>(() => ({
    category,
  }));
};
