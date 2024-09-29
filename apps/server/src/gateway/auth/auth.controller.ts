import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiResponseEntity,
  Auth,
  AuthService,
  LocalAuthGuard,
  LoginPayloadDto,
  Public,
  ResponseEntity,
  SignUpPayloadDto,
  TenantDto,
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

  @UseGuards(LocalAuthGuard)
  @ApiResponseEntity(TokenDto, HttpStatus.OK)
  @Post('token')
  async getToken(@Body() loginDto: LoginPayloadDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user, tenant } = await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('accessToken', accessToken, { httpOnly: true });

    return new ResponseEntity(HttpStatus.OK, '로그인 성공', {
      accessToken,
      refreshToken,
      user: plainToInstance(UserDto, user),
      tenant: plainToInstance(TenantDto, tenant),
    });
  }

  @Auth([])
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Get('new-token')
  async getNewToken(@Req() req: Request & { user: UserDto }, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies['refreshToken'];
    const { userId } = await this.tokenService.validateToken(refreshToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      this.tokenService.generateTokens({
        userId,
      });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.cookie('accessToken', newAccessToken, { httpOnly: true });

    const user = req.user;
    console.log('user', user);
    const tenant = user.tenants.map((tenant) => tenant.active);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: req.user,
      tenant,
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
