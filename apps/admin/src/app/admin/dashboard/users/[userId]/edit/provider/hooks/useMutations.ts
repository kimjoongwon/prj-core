import { useSignUp } from '@hooks';
import { useState } from './useState';

export const useMutations = (state: ReturnType<typeof useState>) => {
  return { signUp: useSignUp({ signUpInput: state }) };
};
