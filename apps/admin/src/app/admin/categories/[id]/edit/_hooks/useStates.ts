import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { useQueries } from './useQueries';

export const useStates = (context: ReturnType<typeof useQueries>) => {
  const { id } = useParams();
  const { categoryFormQuery, categoryQuery } = context;
  const categoryForm = categoryFormQuery?.data?.categoryForm;
  const category = categoryQuery?.data?.category;

  const formState =
    id === 'new'
      ? useLocalObservable<CreateCategoryInput>(
          () => categoryForm || { name: '' },
        )
      : useLocalObservable<UpdateCategoryInput>(() => ({
          name: category?.name || '',
          id: category?.id || '',
          categoryItemId: category?.categoryItemId || null,
        }));

  return { formState };
};
