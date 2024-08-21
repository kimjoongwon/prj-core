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
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginPayloadDto, SignUpPayloadDto, TokenDto } from './dtos';
import {
  ApiEndpoints,
  Auth,
  ContextProvider,
  LocalAuthGuard,
  Public,
  ResponseEntity,
  TenantDto,
  TokenService,
  UserDto,
} from '@shared';

@ApiTags('AUTH')
@Controller(ApiEndpoints.AUTH)
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Auth([], { public: true })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Post('token')
  async getToken(@Body() loginDto: LoginPayloadDto, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken, user, tenant } = await this.authService.login(loginDto);
    this.tokenService.setTokenToHTTPOnlyCookie(res, 'refreshToken', refreshToken);

    return new ResponseEntity(HttpStatus.OK, '로그인 성공', {
      accessToken,
      refreshToken,
      user: new UserDto(user),
      tenant: new TenantDto(tenant),
    });
  }

  @Auth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Get('current-user')
  getCurrentUser(@Req() request) {
    return request.user;
  }

  @Public()
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Get('new-token')
  async getNewToken(@Req() req) {
    const refreshToken = this.tokenService.getTokenFromRequest(req, 'refreshToken');

    const { userId } = await this.authService.validateToken(refreshToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      this.tokenService.generateTokens({
        userId,
      });

    const user = await this.getCurrentUser(newAccessToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  @ApiResponse({ status: HttpStatus.CREATED })
  async signUpUser(@Body() signUpDto: SignUpPayloadDto) {
    return this.authService.signUpUser(signUpDto);
  }
}
