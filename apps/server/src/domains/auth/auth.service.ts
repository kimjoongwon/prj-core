import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { PasswordService } from './services/password.service';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dtos/token.dto';
import { PrismaService } from 'nestjs-prisma';
import {
  AuthConfig,
  RolesService,
  TokenPayloadDto,
  TokenService,
  UsersService,
  goTryRawSync,
} from '@shared';
import bcrypt from 'bcrypt';
import { LoginPayloadDto, SignUpPayloadDto } from './dtos';
import { match } from 'ts-pattern';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private passwordService: PasswordService,
    private config: ConfigService,
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  generateTokens(payload: { userId: string }): Omit<TokenDto, 'user'> {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: { userId: string }): string {
    const authConfig = this.config.get<AuthConfig>('auth');
    return this.jwtService.sign(payload, {
      secret: authConfig?.secret,
      expiresIn: authConfig?.refresh,
    });
  }

  async getCurrentUser(accessToken: string) {
    const [err, { userId }] = goTryRawSync<Error, TokenPayloadDto>(() =>
      this.jwtService.verify<{ userId: string }>(accessToken),
    );
    if (err) throw new BadRequestException('Invalid token');

    return this.usersService.findById(userId);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUniqueByEmail(email);

    const isPasswordValid = await this.validateHash(password, user?.password);

    if (!isPasswordValid) {
      throw new NotFoundException('User not found');
    }

    return user!;
  }

  async signUpUser(signUpDto: SignUpPayloadDto) {
    const { profile, user } = signUpDto;

    await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await this.passwordService.hashPassword(user.password);

      const newUser = await tx.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });

      const userRole = await this.rolesService.findUserRole();

      await tx.tenancy.create({
        data: {
          roleId: userRole!.id,
          spaceId: user.spaceId,
          userId: newUser.id,
        },
      });

      await tx.profile.create({
        data: {
          ...profile,
          userId: newUser.id,
        },
      });

      return this.tokenService.generateTokens({ userId: newUser.id });
    });
  }

  getLoginForm() {
    const loginFormDto = {
      email: '',
      password: '',
    };

    return loginFormDto;
  }

  async login({ email, password }: LoginPayloadDto): Promise<TokenDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profiles: true,
        tenancies: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const { accessToken, refreshToken } = this.generateTokens({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  validateHash(password: string | undefined, hash: string | undefined | null): Promise<boolean> {
    if (!password || !hash) {
      return Promise.resolve(false);
    }

    return bcrypt.compare(password, hash);
  }

  validateToken(token: string) {
    const { secret } = this.config.get<AuthConfig>('auth');

    const [err, payload] = goTryRawSync<JsonWebTokenError, { userId: string }>(() =>
      this.jwtService.verify(token, { secret }),
    );

    match(err.name)
      .with('TokenExpiredError', () => new BadRequestException('토튼 만료 에러'))
      .with('JsonWebTokenError', () => new BadRequestException('토큰 오동작'))
      .with('NotBeforeError', () => new BadRequestException('토큰 미사용'))
      .otherwise(() => new InternalServerErrorException(`알 수 없는 에러: ${err.message}`));

    return payload;
  }
}
