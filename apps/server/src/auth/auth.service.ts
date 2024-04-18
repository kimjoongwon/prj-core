import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { PasswordService } from './password.service';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import {
  AuthConfig,
  RoleType,
  RolesService,
  SpacesService,
  TokenType,
  UsersService,
} from '@shared/backend';
import { CreateSignUpPayloadDto } from './dto/create-user-sign-up.dto';
import { loginFormJsonSchema } from './dto/login-form.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private space: SpacesService,
    private rolesService: RolesService,
    private passwordService: PasswordService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async getCurrentUser({ accessToken }: TokenDto) {
    let userId: string;

    try {
      userId = this.jwtService.verify<{ userId: string }>(accessToken)?.userId;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.usersService.findById(userId);

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    const isPasswordValid = await this.validateHash(password, user?.password);

    if (!isPasswordValid) {
      throw new NotFoundException('User not found');
    }

    return user!;
  }

  async signUpUser(createSignUpPayloadDto: CreateSignUpPayloadDto) {
    const { profile, user } = createSignUpPayloadDto;

    await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await this.passwordService.hashPassword(
        user.password,
      );

      const newUser = await tx.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });

      const baseSpace = await this.space.findBaseSpace();

      const userRole = await this.rolesService.findUserRole();

      await tx.tenant.create({
        data: {
          roleId: userRole!.id,
          spaceId: baseSpace!.id,
          userId: newUser.id,
        },
      });

      await tx.profile.create({
        data: {
          ...profile,
          userId: newUser.id,
        },
      });

      return this.generateTokens({
        userId: newUser.id,
      });
    });
  }

  getLoginForm() {
    const loginFormDto = {
      email: '',
      password: '',
    };

    return loginFormDto;
  }

  getLoginFormJsonSchema() {
    return loginFormJsonSchema;
  }

  async login({ email, password }: LoginPayloadDto): Promise<TokenDto> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return {
      ...this.generateTokens({
        userId: user.id,
      }),
      user,
    };
  }

  validateHash(
    password: string | undefined,
    hash: string | undefined | null,
  ): Promise<boolean> {
    if (!password || !hash) {
      return Promise.resolve(false);
    }

    return bcrypt.compare(password, hash);
  }

  async createAccessToken(data: {
    role: RoleType;
    userId: string;
  }): Promise<TokenPayloadDto> {
    return {
      expiresIn: 3,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    };
  }

  generateTokens(payload: { userId: string }): TokenDto {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const authConfig = this.config.get<AuthConfig>('auth');
    return this.jwtService.sign(payload, {
      secret: authConfig?.secret,
      expiresIn: authConfig?.refresh,
    });
  }

  async validateToken(token: string) {
    let payload = null;

    const authConfig = this.config.get<AuthConfig>('auth');

    try {
      payload = this.jwtService.verify(token, {
        secret: authConfig.secret,
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Invalid token');
    }

    const user = await this.usersService.findById(payload.userId);

    return {
      ...this.generateTokens({ userId: payload.userId }),
      user,
    };
  }
}
