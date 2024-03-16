import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserSignUpDto } from './dtos/create-user-sign-up.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { TokenDto } from './dtos/token.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ProfileDto } from '../profiles/dto/profile.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenDto })
  @Post('login')
  async login(@Body() loginPayloadDto: LoginPayloadDto) {
    return this.authService.login(loginPayloadDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signUp')
  @ApiResponse({ status: HttpStatus.CREATED, type: ProfileDto })
  async signUpUser(@Body() createUserSignUpDto: CreateUserSignUpDto) {
    return this.authService.signUpUser(createUserSignUpDto);
  }
}
