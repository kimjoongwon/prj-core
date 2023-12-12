import { useMutation } from '@apollo/client';
import { LOGIN, REFRESH_TOKEN } from '@gqls';

export const useMutations = () => {
  const loginMutation = useMutation(LOGIN);
  const refreshTokenMutation = useMutation(REFRESH_TOKEN);
  return { loginMutation, refreshTokenMutation };
};
