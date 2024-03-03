import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
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
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { UserLoginDto } from './dtos/user-login.dto';
import { RoleType } from 'src/common/types/RoleTypes';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  @Post('auth/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: RoleType.USER,
    });

    return {
      user: userEntity,
      token,
    };
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
