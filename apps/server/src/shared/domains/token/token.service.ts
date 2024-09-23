import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../configs/config.type';
import { TokenPayloadDto } from './token-payload.dto';
import { TokenDto } from './token.dto';

export const Token = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
};

type TokenValues = (typeof Token)[keyof typeof Token];

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getTokenFromRequest(req: Request, key?: TokenValues): string {
    const token = req.cookies[key || Token.ACCESS];
    if (!token) throw new BadRequestException(`${key}`);
    return req.cookies[key || Token.ACCESS];
  }

  setTokenToHTTPOnlyCookie(res: Response, key: TokenValues, value: string) {
    return res.cookie(key, value, { httpOnly: true });
  }

  generateAccessToken(payload: TokenPayloadDto) {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: TokenPayloadDto) {
    const authConfig = this.configService.get<AuthConfig>('auth');
    return this.jwtService.sign(payload, {
      secret: authConfig?.secret,
      expiresIn: authConfig?.refresh,
    });
  }

  generateTokens(payload: TokenPayloadDto): Omit<TokenDto, 'user'> {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
