import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { Public } from '@shared/backend';
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
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Get('current-user')
  getCurrentUser(@Body() tokenDto: TokenDto) {
    return this.authService.getCurrentUser(tokenDto);
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
