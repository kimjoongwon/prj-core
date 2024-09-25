import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../configs/config.type';
import { TokenPayloadDto } from './token-payload.dto';
import { match } from 'ts-pattern';
import { goTryRawSync } from '@shared';

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

  generateTokens(payload: TokenPayloadDto) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  validateToken(token: string) {
    const { secret } = this.configService.get<AuthConfig>('auth');

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
}
