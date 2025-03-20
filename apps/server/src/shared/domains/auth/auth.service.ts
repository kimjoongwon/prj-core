import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../password/password.service';
import { ResponseEntity } from '../../entities';
import { SignUpPayloadDto } from './dtos/sign-up-payload.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  logger: Logger = new Logger(AuthService.name);
  LOG_PREFIX = `${AuthService.name} DB_INIT`;
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private prisma: PrismaService,
  ) {}

  async getCurrentUser(accessToken: string) {
    const { userId } = this.jwtService.verify<{ userId: string }>(accessToken);
    return this.usersService.getUnique({ where: { id: userId } });
  }

  async getNewToken(refreshToken: string) {
    const { userId } = this.jwtService.verify<{ userId: string }>(refreshToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      this.tokenService.generateTokens({
        userId,
      });

    return {
      newAccessToken,
      newRefreshToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUnique({ where: { name: email } });

    const isPasswordValid = await this.passwordService.validatePassword(password, user?.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        ResponseEntity.WITH_ERROR(HttpStatus.UNAUTHORIZED, '패스워드가 일치하지 않습니다.'),
      );
    }

    return user;
  }

  async signUp(signUpPayloadDto: SignUpPayloadDto) {
    const { email, name, nickname, password, phone, spaceId } = signUpPayloadDto;
    const { id: userId } = await this.usersService.create({
      data: {
        name,
        phone,
        password,
        tenants: {
          create: {
            main: true,
            spaceId,
          },
        },
        profiles: {
          create: {
            name,
            nickname,
          },
        },
      },
    });

    return this.tokenService.generateTokens({ userId });
  }

  async login({ email, password }: LoginPayloadDto) {
    const user = await this.usersService.getUnique({
      where: { name: email },
      include: {
        profiles: true,
        tenants: {
          include: {
            space: true,
            user: true,
          },
        },
      },
    });

    this.logger.log(`User: ${JSON.stringify(user)}`);
    const passwordValid = await this.passwordService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const { accessToken, refreshToken } = this.tokenService.generateTokens({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
