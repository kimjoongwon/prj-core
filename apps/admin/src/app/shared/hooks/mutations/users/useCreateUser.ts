import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@gqls';
import { MutationOptions } from '../../../types/hooks';

export const useCreateUser = (option?: MutationOptions) => {
  return useMutation(CREATE_USER, option);
};
