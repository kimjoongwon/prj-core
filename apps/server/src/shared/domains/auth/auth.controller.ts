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
import { LoginPayloadDto, SignUpPayloadDto, TokenDto } from './dtos';
import { ApiResponseEntity, Auth, Public } from '../../decorators';
import { ResponseEntity, UserDto, TenantDto } from '../../entities';
import { LocalAuthGuard } from '../../guards';
import { TokenService } from '../token';
import { AuthService } from './auth.service';

@ApiTags('AUTH')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiResponseEntity(TokenDto, HttpStatus.OK)
  @Post('token')
  async getToken(@Body() loginDto: LoginPayloadDto, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken, user, tenant } = await this.authService.login(loginDto);
    this.tokenService.setTokenToHTTPOnlyCookie(res, 'refreshToken', refreshToken);
    this.tokenService.setTokenToHTTPOnlyCookie(res, 'accessToken', accessToken);

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

  @Auth([])
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Get('new-token')
  async getNewToken(@Req() req, @Res({ passthrough: true }) res) {
    const refreshToken = this.tokenService.getTokenFromRequest(req, 'refreshToken');

    const { userId } = await this.authService.validateToken(refreshToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      this.tokenService.generateTokens({
        userId,
      });
    this.tokenService.setTokenToHTTPOnlyCookie(res, 'refreshToken', refreshToken);
    this.tokenService.setTokenToHTTPOnlyCookie(res, 'accessToken', newAccessToken);
    const user = req.user as UserDto;
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
      await this.authService.signUpUser(signUpDto),
    );
  }
}
