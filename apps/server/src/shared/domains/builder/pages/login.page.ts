import { Injectable } from '@nestjs/common';
import { LoginForm } from '../forms/login.form';

@Injectable()
export class LoginPage {
  constructor(readonly loginForm: LoginForm) {}

  getState() {
    const state = {
      form: {
        inputs: {
          email: 'galaxy@gmail.com',
          password: 'rkdmf12!@',
        },
      },
    };

    return state;
  }

  getMeta() {
    const loginForm = this.loginForm.getMeta();
    const loginPage = {
      name: '로그인',
      state: this.getState(),
      form: loginForm,
    };

    return loginPage;
  }
}
