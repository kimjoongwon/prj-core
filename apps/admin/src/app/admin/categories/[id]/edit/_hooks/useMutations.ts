import {
  useCoCRouter,
  useCreateCategory,
  useUpdateCategory,
  useUpdateUser,
} from '@hooks';
import { CreateCategoryInput, UpdateUserInput } from '@__generated__/graphql';
import { toJS } from 'mobx';
import { useStates } from './useStates';

export const useMutations = (states: ReturnType<typeof useStates>) => {
  const { formState } = states;
  const router = useCoCRouter();
  return {
    createCategory: useCreateCategory(
      {
        createCategoryInput: toJS(formState) as unknown as CreateCategoryInput,
      },
      {
        onCompleted: () => {
          router.back();
        },
      },
    ),
    updateCategory: useUpdateCategory(
      {
        updateCategoryInput: toJS(formState) as unknown as UpdateUserInput,
      },
      {
        onCompleted: () => {
          router.back();
        },
      },
    ),
  };
};
