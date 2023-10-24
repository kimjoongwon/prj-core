import {
  CreateCategoryItemInput,
  UpdateCategoryItemInput,
} from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useParams, useSearchParams } from 'next/navigation';
import { useQueries } from './useQueries';

export const useState = (context: ReturnType<typeof useQueries>) => {
  const { id = 'new' } = useParams();
  const searchParams = useSearchParams();

  const {
    categoryItemQuery: { data },
    categoryItemFormQuery: {
      data: { categoryItemForm },
    },
  } = context;

  const createCategoryItemInput = useLocalObservable<CreateCategoryItemInput>(
    () => ({
      name: categoryItemForm.name,
      parentId: searchParams.get('parentId') || 'root',
    }),
  );

  const updateCategoryItemInput = useLocalObservable<UpdateCategoryItemInput>(
    () => ({
      id: id as string,
      name: data?.categoryItem.name,
      parentId: data?.categoryItem.parentId,
    }),
  );

  return {
    createCategoryItemInput,
    updateCategoryItemInput,
  };
};
