import { Injectable } from '@nestjs/common';
import { FormBuilder } from '@shared/types';
import { EmailInput } from '../inputs/email.input';
import { PasswordInput } from '../inputs/password.input';

@Injectable()
export class LoginForm {
  constructor(
    readonly passwordInput: PasswordInput,
    readonly emailInput: EmailInput,
  ) {}

  getMeta(): FormBuilder {
    const passwordInput = this.passwordInput.getMeta();
    const emailInput = this.emailInput.getMeta();

    return {
      isInValid: false,
      name: '로그인',
      button: {
        name: '로그인',
        mutation: {
          name: 'getToken',
          payloadPath: 'form.inputs',
        },
        alert: {
          message: '로그인 성공',
        },
        navigator: {
          pathname: '/admin/main/tenancies',
        },
      },
      sections: [
        {
          name: '로그인',
          stacks: [
            {
              type: 'VStack',
              inputs: [emailInput, passwordInput],
            },
          ],
        },
      ],
    };
  }
}
