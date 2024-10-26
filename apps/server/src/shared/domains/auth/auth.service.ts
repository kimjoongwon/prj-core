import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../password/password.service';
import { UsersService, ResponseEntity } from '../../entities';
import { goTryRawSync } from '../../libs';
import { TokenService } from '../token';
import { SignUpPayloadDto } from './dtos/sign-up-payload.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';

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
    const [err, { userId }] = goTryRawSync<Error, { userId: string }>(() =>
      this.jwtService.verify<{ userId: string }>(accessToken),
    );
    if (err) throw new BadRequestException('Invalid token');

    return this.usersService.getUnique({ where: { id: userId } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUnique({ where: { email } });

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
    const role = await this.prisma.role.findUnique({ where: { name: 'USER' } });
    const { id: userId } = await this.usersService.create({
      data: {
        email,
        name,
        phone,
        password,
        profiles: {
          create: {
            nickname,
          },
        },
        tenants: {
          create: {
            spaceId,
            active: true,
            roleId: role.id,
          },
        },
      },
    });

    return this.tokenService.generateTokens({ userId });
  }

  async login({ email, password }: LoginPayloadDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profiles: true,
        tenants: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        userId: user.id,
        active: true,
      },
      include: {
        role: true,
      },
    });
    console.log(user.password);
    const passwordValid = await this.passwordService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const { accessToken, refreshToken } = this.tokenService.generateTokens({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user,
      tenant,
    };
  }
}
