import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, UsersService } from '@shared';

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const authConfig = config.get<AuthConfig>('auth');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
