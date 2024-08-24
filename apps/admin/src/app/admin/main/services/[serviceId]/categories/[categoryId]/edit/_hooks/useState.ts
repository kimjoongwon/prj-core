import { useLocalObservable } from 'mobx-react-lite';
import {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@shared/frontend';
import { useQueries } from './useQueries';

export const useState = (props: ReturnType<typeof useQueries>) => {
  const { category } = props;

  return useLocalObservable<{
    category: CategoryDto | CreateCategoryDto | UpdateCategoryDto | undefined;
  }>(() => ({
    category,
  }));
};
