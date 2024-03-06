import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserSignUpDto } from './dtos/create-user-sign-up.dto';
import { RoleType } from 'src/common/types/RoleTypes';
import { TokenPayloadDto } from './dtos/token-payload.dto';
import { TokenType } from 'src/common/types/TokenTypes';
import { PasswordService } from './password.service';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'src/configs';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { TokenDto } from './dtos/token.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { RolesService } from '../roles/roles.service';
import { SpacesService } from '../spaces/spaces.service';
import { UserEntity } from '../users/user.entity';

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

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findOneByEmail(email);

    const isPasswordValid = await this.validateHash(password, user?.password);

    if (!isPasswordValid) {
      throw new NotFoundException('User not found');
    }

    return user!;
  }

  async signUpUser(userSignUpDto: CreateUserSignUpDto) {
    const { createProfileDto, createUserDto } = userSignUpDto;

    await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await this.passwordService.hashPassword(
        userSignUpDto.createUserDto.password,
      );

      const newUser = await tx.user.create({
        data: {
          ...createUserDto,
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
          ...createProfileDto,
          userId: newUser.id,
        },
      });

      return this.generateTokens({
        userId: newUser.id,
      });
    });
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

    return this.generateTokens({
      userId: user.id,
    });
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
    // const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: authConfig?.secret,
      expiresIn: authConfig?.refresh,
    });
    // const securityConfig = this.configService.get<SecurityConfig>('security');
    // return this.jwtService.sign(payload, {
    //   secret: this.configService.get('JWT_REFRESH_SECRET'),
    //   expiresIn: securityConfig.refreshIn,
    // });
  }
}
