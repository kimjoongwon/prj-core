import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { type LoginPayloadDto, ResponseEntity, type SignUpPayloadDto } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import type { PasswordService } from './password.service';
import type { TokenService } from './token.service';
import type { UsersService } from './users.service';

@Injectable()
export class AuthService {
  logger: Logger = new Logger(AuthService.name);
  LOG_PREFIX = `${AuthService.name} DB_INIT`;
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private prisma: PrismaService
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
      this.logger.warn(
        `Invalid password attempt for user: ${email}. User: ${JSON.stringify(user)}`
      );
      throw new UnauthorizedException(
        ResponseEntity.WITH_ERROR(HttpStatus.UNAUTHORIZED, '패스워드가 일치하지 않습니다.')
      );
    }

    return user;
  }

  async signUp(signUpPayloadDto: SignUpPayloadDto) {
    const { email, name, nickname, password, phone, spaceId } = signUpPayloadDto;

    // USER 역할 찾기 또는 생성
    let userRole = await this.prisma.role.findFirst({
      where: { name: 'USER' },
    });

    if (!userRole) {
      userRole = await this.prisma.role.create({
        data: { name: 'USER' },
      });
    }

    const { id: userId } = await this.usersService.create({
      data: {
        name,
        phone,
        password,
        tenants: {
          create: {
            main: true,
            spaceId,
            roleId: userRole.id,
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
            space: {
              include: {
                ground: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`User: ${JSON.stringify(user)}`);

    if (!user) {
      throw new UnauthorizedException('유저가 존재하지 않습니다.');
    }

    const passwordValid = await this.passwordService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
