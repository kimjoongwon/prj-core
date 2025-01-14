import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, UsersService } from '@shared';
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
          console.log(req.cookies);
          return req.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: authConfig?.secret,
    });
  }

  async validate({ userId }: { userId: string; iat: number; exp: number }) {
    const user = await this.usersService.getUnique({
      where: { id: userId },
      include: { tenants: true },
    });
    return { user };
  }
}
