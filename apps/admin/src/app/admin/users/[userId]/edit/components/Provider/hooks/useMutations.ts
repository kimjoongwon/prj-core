import { useSignUp, useUpdateUser } from '@hooks';
import { useState } from './useState';
import { SignupInput } from '@__generated__/graphql';

export const useMutations = (state: ReturnType<typeof useState>) => {
  return {
    signUp: useSignUp({ signUpInput: state as unknown as SignupInput }),
    updateUser: useUpdateUser(),
  };
};
