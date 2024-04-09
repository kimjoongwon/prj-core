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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { AccessToken, Public } from '@shared/backend';
import { CreateSignUpPayloadDto } from './dto/create-user-sign-up.dto';
import { LoginFormDto } from './dto/login-form.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const { refreshToken, ...rest } = await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.json({ ...rest });
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Get('current-user')
  getCurrentUser(@AccessToken() accessToken: string) {
    return this.authService.getCurrentUser({ accessToken });
  }

  @Public()
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @Get('refresh-token')
  refreshToken(@Req() req) {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const { accessToken, refreshToken } =
      this.authService.validateToken(oldRefreshToken);

    req.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginFormDto })
  @Get('login/form')
  getLoginForm() {
    return this.authService.getLoginForm();
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('login/schema')
  getLoginFormSchema() {
    return this.authService.getLoginFormJsonSchema();
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  async signUpUser(@Body() createSignUpPayload: CreateSignUpPayloadDto) {
    return this.authService.signUpUser(createSignUpPayload);
  }
}
