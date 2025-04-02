import { Controller, Post, Body, HttpStatus, HttpCode, Get, Res, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiResponseEntity,
  Auth,
  AuthService,
  ContextProvider,
  LoginPayloadDto,
  Public,
  ResponseEntity,
  SignUpPayloadDto,
  TokenDto,
  TokenService,
  UserDto,
} from '@shared';
import { plainToInstance } from 'class-transformer';
import { Response, Request } from 'express';

@ApiTags('AUTH')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

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
        user,
        mainTenantId: tenant?.id,
      }),
    );
  }

  @Auth([])
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Get('new-token')
  async getNewToken(
    @Req() req: Request & { user: UserDto },
    @Res({ passthrough: true }) res,
  ): Promise<TokenDto> {
    const refreshToken = req.cookies['refreshToken'];
    const { newAccessToken, newRefreshToken } = await this.authService.getNewToken(refreshToken);

    const user = req.user;

    const tenant = user.tenants.find((tenant) => tenant.main);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    res.cookie('mainTenantId', tenant.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      mainTenantId: tenant.id,
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

  @Auth([], { public: false })
  @HttpCode(HttpStatus.OK)
  @Get('verify-token')
  @ApiResponseEntity(Boolean, HttpStatus.OK)
  async verifyToken() {
    const token = ContextProvider.getToken();
    const isValid = this.tokenService.verifyToken(token);
    return new ResponseEntity(HttpStatus.OK, '토큰 유효성 검증 완료', isValid);
  }
}
