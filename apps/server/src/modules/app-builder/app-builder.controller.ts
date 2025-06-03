import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, AuthService, LoginPayloadDto, ResponseEntity, TokenDto } from '@shared';
import { AppBuilderService } from './app-builder.service';
import { Response } from 'express';
import { ButtonResponse } from '@shared/specs';

@ApiTags('BUILDER')
@Controller()
export class AppBuilderController {
  constructor(
    private readonly appBuilderService: AppBuilderService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Auth([], { public: true })
  async getAppBuilder() {
    const app = await this.appBuilderService.build();
    return new ResponseEntity(200, '성공', app);
  }

  @Post('login-button')
  async loginButton(
    @Body() login: LoginPayloadDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(login);
    const tenant = user.tenants?.find((tenant) => tenant.main);

    res.cookie('tenantId', tenant.id, {
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });

    const buttonResponse: ButtonResponse<TokenDto> = {
      routeName: '관리자',
      toast: {
        color: 'success',
        title: '로그인 성공',
        description: '로그인에 성공했습니다.',
      },
    };

    return new ResponseEntity(200, '성공', buttonResponse);
  }
}
