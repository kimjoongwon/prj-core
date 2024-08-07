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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginPayloadDto, SignUpPayloadDto, TokenDto } from './dtos';
import {
  AccessToken,
  LocalAuthGuard,
  Public,
  ResponseEntity,
  TenantDto,
  TokenService,
  UserDto,
} from '@shared';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Post('login')
  async login(@Body() loginDto: LoginPayloadDto, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken, user, tenant } = await this.authService.login(loginDto);
    this.tokenService.setTokenToHTTPOnlyCookie(res, 'refreshToken', refreshToken);

    return new ResponseEntity(HttpStatus.OK, '로그인 성공', {
      accessToken,
      refreshToken,
      user: new UserDto(user),
      tenant: new TenantDto(tenant),
    });
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Get('current-user')
  getCurrentUser(@Req() request) {
    return request;
  }

  @Public()
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Get('token')
  async getToken(@Req() req) {
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
