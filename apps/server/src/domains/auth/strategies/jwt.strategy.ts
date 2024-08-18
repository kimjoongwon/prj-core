import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, UserService } from '@shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    const authConfig = config.get<AuthConfig>('auth');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig?.secret,
    });
  }

  async validate({ userId }: { userId: string; iat: number; exp: number }) {
    const user = await this.userService.getUniqueById(userId);
    console.log('user', user);
    return { user };
  }
}
