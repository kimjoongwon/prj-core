import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
  TenanciesService,
  TenantsService,
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
  logger: Logger = new Logger(AuthService.name);
  LOG_PREFIX = `${AuthService.name} DB_INIT`;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private passwordService: PasswordService,
    private config: ConfigService,
    private prisma: PrismaService,
    private tokenService: TokenService,
    private tenanciesService: TenanciesService,
    private tenantsService: TenantsService,
  ) {}

  generateTokens(payload: { userId: string }): Omit<TokenDto, 'user' | 'tenant'> {
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

    return this.usersService.getUniqueById(userId);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUniqueByEmail(email);

    const isPasswordValid = await this.validateHash(password, user?.password);

    if (!isPasswordValid) {
      throw new NotFoundException('User not found');
    }

    return user!;
  }

  async signUpUser(signUpPayloadDto: SignUpPayloadDto) {
    const { email, name, nickname, password, phone, spaceId } = signUpPayloadDto;

    await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await this.passwordService.hashPassword(password);

      const newUser = await tx.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
        },
      });

      const userRole = await this.rolesService.findUserRole();

      const tenancy = await tx.tenancy.create({
        data: {
          spaceId,
        },
      });

      await tx.tenant.create({
        data: {
          type: 'PHYSICAL',
          active: true,
          userId: newUser.id,
          tenancyId: tenancy.id,
          roleId: userRole.id,
        },
      });

      await tx.profile.create({
        data: {
          nickname,
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

  async login({ email, password }: LoginPayloadDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profiles: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        role: true,
        tenancy: true,
      },
    });

    const passwordValid = await this.passwordService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const { accessToken, refreshToken } = this.generateTokens({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user,
      tenant,
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

    match(err?.name)
      .with('TokenExpiredError', () => new BadRequestException('토튼 만료 에러'))
      .with('JsonWebTokenError', () => new BadRequestException('토큰 오동작'))
      .with('NotBeforeError', () => new BadRequestException('토큰 미사용'))
      .otherwise(() => new InternalServerErrorException(`알 수 없는 에러: ${err?.message}`));

    return payload;
  }

  async createInitRoles() {
    this.logger.log(`[${this.LOG_PREFIX}] Create SUPER_ADMIN Role`);

    const superAdminRole = await this.rolesService.getSuperAdminRole();

    this.logger.log(`[${this.LOG_PREFIX}] Create USER Role`);

    const userRole = await this.rolesService.getUserRole();

    if (!superAdminRole) {
      this.logger.log('Create SUPER_ADMIN Role');
      await this.rolesService.createSuperAdmin();
    }

    if (!userRole) {
      this.logger.log('Create USER Role');
      await this.rolesService.createUser();
    }
  }

  async createSuperAdmin(signUpPayloadDto: SignUpPayloadDto) {
    const { email, name, nickname, password, phone, spaceId } = signUpPayloadDto;

    const hashedPassword = await this.passwordService.hashPassword(password);

    const newUser = await this.usersService.upsert({
      email,
      name,
      phone,
      password: hashedPassword,
    });
    const userId = newUser.id;
    await this.prisma.profile.upsert({
      where: {
        userId,
      },
      update: {
        userId,
        nickname,
      },
      create: {
        userId,
        nickname,
      },
    });

    const superAdminRole = await this.rolesService.findSuperAdminRole();

    const tenancy = await this.tenanciesService.createOrUpdate({ spaceId });

    await this.tenantsService.createOrUpdate({
      tenancyId: tenancy.id,
      userId: newUser.id,
      active: true,
      roleId: superAdminRole.id,
      type: 'PHYSICAL',
    });

    await this.tenantsService.createOrUpdate({
      roleId: superAdminRole.id,
      type: 'PHYSICAL',
      active: true,
      userId: newUser.id,
      tenancyId: tenancy.id,
    });
  }
}
