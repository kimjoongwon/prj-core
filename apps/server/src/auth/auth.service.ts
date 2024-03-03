import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserSignUpDto } from './dtos/create-user-sign-up.dto';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserEntity } from 'src/users/user.entity';
import { RoleType } from 'src/common/types/RoleTypes';
import { TokenPayloadDto } from './dtos/token-payload.dto';
import { TokenType } from 'src/common/types/TokenTypes';
import bcrypt from 'bcrypt';
import { SpacesService } from 'src/spaces/spaces.service';
import { TenantsService } from 'src/tenants/tenants.service';
import { RolesService } from 'src/roles/roles.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private profilesService: ProfilesService,
    private jwtService: JwtService,
    private space: SpacesService,
    private rolesService: RolesService,
    private passwordService: PasswordService,
    private prisma: PrismaService,
  ) {}

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const email = userLoginDto.email;
    const user = await this.usersService.findOne(email);

    const isPasswordValid = await this.validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('User not found');
    }

    return user!;
  }

  async signUpUser(userSignUpDto: CreateUserSignUpDto) {
    const { createProfileDto, createUserDto } = userSignUpDto;

    const hashedPassword = await this.passwordService.hashPassword(
      userSignUpDto.createUserDto.password,
    );

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const baseSpace = await this.space.findBaseSpace();

    const userRole = await this.rolesService.findUserRole();

    await this.tenantsService.create({
      roleId: userRole!.id,
      spaceId: baseSpace!.id,
      userId: newUser.id,
    });

    await this.profilesService.create({
      ...createProfileDto,
      userId: newUser.id,
    });

    return this.generateTokens({
      userId: newUser.id,
    });
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
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

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    // const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: 'JWT_REFRESH_SECRET',
      expiresIn: '3d',
    });
    // const securityConfig = this.configService.get<SecurityConfig>('security');
    // return this.jwtService.sign(payload, {
    //   secret: this.configService.get('JWT_REFRESH_SECRET'),
    //   expiresIn: securityConfig.refreshIn,
    // });
  }
}
