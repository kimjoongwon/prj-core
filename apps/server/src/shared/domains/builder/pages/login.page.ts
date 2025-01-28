import { Injectable, Module } from '@nestjs/common';
import { LoginFormBuilder, LoginFormBuilderModule } from '../forms/login.form';

@Injectable()
export class LoginPageBuilder {
  constructor(readonly loginFormBuilder: LoginFormBuilder) {}

  getState() {
    const state = {
      form: {
        data: {
          email: 'galaxy@gmail.com',
          password: 'rkdmf12!@',
        },
      },
    };

    return state;
  }

  getMeta() {
    const loginForm = this.loginFormBuilder.getMeta();
    const loginPage = {
      name: '로그인',
      state: this.getState(),
      form: loginForm,
    };

    return loginPage;
  }
}

@Module({
  imports: [LoginFormBuilderModule],
  providers: [LoginPageBuilder],
  exports: [LoginPageBuilder],
})
export class LoginPageBuilderModule {}
