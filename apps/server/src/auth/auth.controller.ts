import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserSignUpDto } from './dtos/create-user-sign-up.dto';
import { ProfileDto } from 'src/profiles/dto/profile.dto';
import { LoginDto } from './dtos/login.dto';
import { TokenDto } from './dtos/token.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenDto })
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('auth/signUp')
  @ApiResponse({ status: HttpStatus.CREATED, type: ProfileDto })
  async signUpUser(@Body() createUserSignUpDto: CreateUserSignUpDto) {
    return this.authService.signUpUser(createUserSignUpDto);
  }
}
