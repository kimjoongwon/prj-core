import { Controller, Get, HttpStatus } from '@nestjs/common';
import { LoginRouteBuilder } from '../routes/login.route';
import { ApiResponseEntity } from '../../../decorators';
import { ResponseEntity } from '../../../entities';

@Controller()
export class AdminAuthRouteController {
  constructor(readonly loginRouteBuilder: LoginRouteBuilder) {}

  @Get('login')
  @ApiResponseEntity(Object)
  getAdminAuthLoginRoute() {
    const loginRouteBuilder = this.loginRouteBuilder.getMeta();
    return new ResponseEntity(HttpStatus.OK, '로그인 페이지', loginRouteBuilder);
  }
}
