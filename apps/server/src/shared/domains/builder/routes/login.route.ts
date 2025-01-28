import { RouteBuilder } from '@shared/types';
import { LoginPageBuilder, LoginPageBuilderModule } from '../pages';
import { Injectable, Module } from '@nestjs/common';

@Injectable()
export class LoginRouteBuilder {
  constructor(readonly loginPageBuilder: LoginPageBuilder) {}

  getMeta() {
    const loginPage = this.loginPageBuilder.getMeta();
    const route: RouteBuilder = {
      name: '로그인',
      pathname: 'login',
      page: loginPage,
    };

    return route;
  }
}

@Module({
  imports: [LoginPageBuilderModule],
  providers: [LoginRouteBuilder],
  exports: [LoginRouteBuilder],
})
export class LoginRouteBuilderModule {}
