import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, ContextProvider, UsersService } from '@shared';
import { Request } from 'express';

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly config: ConfigService,
    readonly usersService: UsersService,
  ) {
    const authConfig = config.get<AuthConfig>('auth');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies?.accessToken;
          ContextProvider.setToken(token);
          return token;
        },
        (req: Request) => {
          const token = req.headers?.authorization?.split(' ')[1];
          ContextProvider.setToken(token);
          return token;
        },
      ]),
      secretOrKey: authConfig?.secret,
    });
  }

  async validate(payload: { userId: string; iat: number; exp: number }) {
    const user = await this.usersService.getUnique({
      where: { id: payload.userId },
      include: { tenants: true },
    });

    return { user };
  }
}
