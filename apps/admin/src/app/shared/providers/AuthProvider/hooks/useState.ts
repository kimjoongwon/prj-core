import { LoginInput, LoginMutation } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';

interface Auth {
  loginForm: LoginInput;
  user: LoginMutation['login']['user'] | null;
  loading: boolean;
  accessToken?: string;
}

export const useState = () => {
  return useLocalObservable<Auth>(() => ({
    accessToken: undefined,
    loading: false,
    loginForm: {
      email: '',
      password: '',
    },
    user: null,
  }));
};
