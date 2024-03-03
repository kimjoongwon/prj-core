import {
  Controller,
  Request,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserSignUpDto } from './dtos/create-user-sign-up.dto';
import { ProfileDto } from 'src/profiles/dto/profile.dto';
import { LoginDto } from './dtos/login.dto';
import { TokenDto } from './dtos/token.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenDto })
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('auth/signUp')
  @ApiResponse({ status: HttpStatus.CREATED, type: ProfileDto })
  async signUpUser(@Body() createUserSignUpDto: CreateUserSignUpDto) {
    return this.authService.signUpUser(createUserSignUpDto);
  }
}
