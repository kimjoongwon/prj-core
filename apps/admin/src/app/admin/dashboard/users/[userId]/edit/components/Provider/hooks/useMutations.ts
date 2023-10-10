import { useSignUp, useUpdateUser } from '@hooks';
import { useState } from './useState';
import { SignupInput, UpdateUserInput } from '@__generated__/graphql';

export const useMutations = (state: ReturnType<typeof useState>) => {
  return {
    signUp: useSignUp({ signUpInput: state as SignupInput }),
    updateUser: useUpdateUser({ updateUserInput: state as UpdateUserInput }),
  };
};
