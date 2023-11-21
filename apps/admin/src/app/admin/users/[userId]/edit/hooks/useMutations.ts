import { useCreateUser, useSignUp, useUpdateUser } from '@hooks';
import { useState } from './useState';

export const useMutations = (state: ReturnType<typeof useState>) => {
  return {
    createUser: useCreateUser(),
    updateUser: useUpdateUser(),
  };
};
