import { Controller, Post, Body, HttpStatus, HttpCode, Get, Res, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiResponseEntity,
  Auth,
  AuthService,
  LoginPayloadDto,
  Public,
  ResponseEntity,
  SignUpPayloadDto,
  TokenDto,
  UserDto,
} from '@shared';
import { plainToInstance } from 'class-transformer';
import { Response, Request } from 'express';

@ApiTags('AUTH')
@Controller()
export class AuthEndpoint {
  constructor(private readonly authService: AuthService) {}

  @ApiResponseEntity(TokenDto, HttpStatus.OK)
  @Post('token')
  async getToken(@Body() loginDto: LoginPayloadDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);
    const tenant = user.tenants.find((tenant) => tenant.main);

    res.cookie('tenantId', tenant.id, {
      httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });

    return new ResponseEntity(
      HttpStatus.OK,
      '로그인 성공',
      plainToInstance(TokenDto, {
        accessToken,
        refreshToken,
        user: user.toDto(),
      }),
    );
  }

  @Auth([])
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Get('new-token')
  async getNewToken(@Req() req: Request & { user: UserDto }, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies['refreshToken'];
    const { newAccessToken, newRefreshToken } = await this.authService.getNewToken(refreshToken);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    res.cookie('tenantId', req.user.tenants[0].id, { httpOnly: true });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: req.user,
    };
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  @ApiResponseEntity(TokenDto, HttpStatus.CREATED)
  async signUpUser(@Body() signUpDto: SignUpPayloadDto) {
    return new ResponseEntity(
      HttpStatus.CREATED,
      '회원가입 성공',
      await this.authService.signUp(signUpDto),
    );
  }
}
