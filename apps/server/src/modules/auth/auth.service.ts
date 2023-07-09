import { User } from '@prisma/client';
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
import { PrismaService } from 'nestjs-prisma';
import { AuthConfig } from '../../configs';

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

    const { userId } = await this.prisma.profile.create({
      data: {
        nickname,
        phone,
        user: {
          create: {
            password: hashedPassword,
            email,
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
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: string }): Token {
    console.log('generateTokens', payload);
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<AuthConfig>('auth').secret,
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
