import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponseEntity } from '../../../../shared/decorator';
import { ResponseEntity } from '../../../../shared/entity';
import { LoginPage } from '../pages/login.page';

@Controller()
export class AdminAuthRouteController {
  constructor(readonly loginPage: LoginPage) {}

  @Get('login')
  @ApiResponseEntity(Object)
  getAdminAuthLoginRoute() {
    const loginPage = this.loginPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, '로그인 페이지', loginPage);
  }
}
