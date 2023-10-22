import { useCreateCategory, useUpdateUser } from '@hooks';
import { useState } from './useState';
import { CreateCategoryInput, UpdateUserInput } from '@__generated__/graphql';
import { toJS } from 'mobx';

export const useMutations = (state: ReturnType<typeof useState>) => {
  return {
    createCategory: useCreateCategory({
      createCategoryInput: toJS(state) as unknown as CreateCategoryInput,
    }),
    updateUser: useUpdateUser({
      updateUserInput: state as unknown as UpdateUserInput,
    }),
  };
};
