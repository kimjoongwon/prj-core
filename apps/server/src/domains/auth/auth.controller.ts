import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessToken, Public, UserDto } from '@shared';
import { LoginPayloadDto, SignUpPayloadDto, TokenDto } from './dtos';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Post('login')
  async login(
    @Body() loginDto: LoginPayloadDto,
    @Res({ passthrough: true }) res,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Get('current-user')
  getCurrentUser(@AccessToken() accessToken: string) {
    return this.authService.getCurrentUser(accessToken);
  }

  @Public()
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const { accessToken, refreshToken, user } =
      await this.authService.validateToken(oldRefreshToken);

    req.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
      user,
    };
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  async signUpUser(@Body() signUpDto: SignUpPayloadDto) {
    return this.authService.signUpUser(signUpDto);
  }
}
