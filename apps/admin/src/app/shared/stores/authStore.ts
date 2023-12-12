import {
  LoginInput,
  LoginMutation,
  RefreshTokenMutation,
} from '@__generated__/graphql';
import { observable } from 'mobx';

interface Auth {
  loginForm: LoginInput;
  user:
    | LoginMutation['login']['user']
    | RefreshTokenMutation['refreshToken']['user']
    | null;
  loading: boolean;
  accessToken?: string;
}

export const authStore = observable<Auth>({
  accessToken: undefined,
  loading: false,
  loginForm: {
    email: '',
    password: '',
  },
  user: null,
});
