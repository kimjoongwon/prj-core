import { useMutation } from '@apollo/client';
import { LOGIN, LOGOUT, REFRESH_TOKEN } from '@gqls';

export const useMutations = () => {
  const loginMutation = useMutation(LOGIN);
  const refreshTokenMutation = useMutation(REFRESH_TOKEN);
  const logoutMutation = useMutation(LOGOUT);
  return { loginMutation, refreshTokenMutation, logoutMutation };
};
