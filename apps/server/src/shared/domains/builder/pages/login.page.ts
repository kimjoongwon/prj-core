import { Injectable } from '@nestjs/common';
import { LoginForm } from '../forms/login.form';
import { PageBuilder } from '@shared/types';
import { loginPayloadValidations } from '../../auth/dtos/login-payload.dto';

@Injectable()
export class LoginPage {
  constructor(readonly loginForm: LoginForm) {}

  getState() {
    const state = {
      form: {
        inputs: {
          email: 'plate@gmail.com',
          password: 'rkdmf12!@',
        },
      },
    };

    return state;
  }

  getMeta() {
    const loginPage: PageBuilder = {
      name: '로그인',
      state: this.getState(),
      form: {
        isInValid: false,
        validations: loginPayloadValidations,
      },
    };

    return loginPage;
  }
}
