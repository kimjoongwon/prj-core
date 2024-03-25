import {
  LoginMutationBody,
  LoginMutationResult,
} from '@shared/frontend';
import { observable } from 'mobx';

interface Auth {
  loginForm: LoginMutationBody;
  user?: LoginMutationResult['data'];
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
  user: undefined,
});
