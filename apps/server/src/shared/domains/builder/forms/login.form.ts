import { Injectable, Module } from '@nestjs/common';
import { PasswordInputBuilder } from '../inputs/password.input';
import { EmailInputBuilder } from '../inputs/email.input';
import { FormBuilder } from '@shared/types';

@Injectable()
export class LoginFormBuilder {
  constructor(
    readonly passwordInputBuilder: PasswordInputBuilder,
    readonly emailInputBuilder: EmailInputBuilder,
  ) {}

  getMeta(): FormBuilder {
    const passwordInput = this.passwordInputBuilder.getMeta();
    const emailInput = this.emailInputBuilder.getMeta();

    return {
      isInValid: false,
      name: '로그인',
      button: {
        name: '로그인',
        mutation: {
          name: 'getToken',
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

@Module({
  providers: [EmailInputBuilder, PasswordInputBuilder, LoginFormBuilder],
  exports: [LoginFormBuilder],
})
export class LoginFormBuilderModule {}
