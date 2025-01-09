import { RouteBuilder } from '@shared/types';
import { loginPage } from './login.page';

export const loginRoute: RouteBuilder = {
  name: '로그인',
  pathname: 'login',
  children: [],
  layout: {
    type: 'Auth',
    page: loginPage,
  },
};
