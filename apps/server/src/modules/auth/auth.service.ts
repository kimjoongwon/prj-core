import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from './models/token.model';
import { SignupInput } from './dto/signup.input';
import { PasswordService } from './providers/password.service';
import { AuthConfig } from '../../configs';
import { PrismaService } from '../global/prisma/prisma.service';
import { User } from '../users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const {
      email,
      password,
      profile: { nickname, phone },
    } = payload;

    const hashedPassword = await this.passwordService.hashPassword(password);

    const { id: userId } = await this.prisma.user.create({
      data: {
        name: email,
        email,
        password: hashedPassword,
        profiles: {
          create: {
            nickname,
            phone,
          },
        },
      },
    });

    return this.generateTokens({ userId });
  }

  async login(email: string, password: string): Promise<Token> {
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

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: true,
        tenants: true,
      },
    });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profiles: true,
        tenants: true,
      },
    });
  }

  async generateTokens(payload: { userId: string }): Promise<Token> {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      user: await this.prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          profiles: true,
          tenants: true,
        },
      }),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    const authConfig = this.configService.get<AuthConfig>('auth');
    return this.jwtService.sign(payload, {
      secret: authConfig.secret,
      expiresIn: authConfig.expires,
    });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const authConfig = this.configService.get<AuthConfig>('auth');
    return this.jwtService.sign(payload, {
      secret: authConfig.secret,
      expiresIn: authConfig.refresh,
    });
  }

  refreshToken(token: string) {
    const authConfig = this.configService.get<AuthConfig>('auth');
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: authConfig.secret,
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
