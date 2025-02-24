import { Injectable } from '@nestjs/common';
import { LoginForm } from '../forms/login.form';
import { PageBuilder } from '@shared/types';

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
    const loginPage: PageBuilder = {
      name: '로그인',
      state: this.getState(),
      form: {
        validations: {
          email: {
            timings: ['onChange'],
            required: {
              value: true,
              message: '이메일을 입력해주세요',
            },
            patterns: [
              {
                value: '^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$',
                message: '이메일 형식이 올바르지 않습니다',
              },
            ],
          },
          password: {
            timings: ['onChange'],
            required: {
              value: true,
              message: '비밀번호를 입력해주세요',
            },
            patterns: [
              {
                value: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
                message: '비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.',
              },
            ],
          },
        },
      },
    };

    return loginPage;
  }
}
