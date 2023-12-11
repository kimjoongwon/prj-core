import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtDto } from '../dto/jwt.dto';
import { AuthConfig } from '../../../configs';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const authConfig = configService.get<AuthConfig>('auth');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.secret,
    });
  }

  async validate(payload: JwtDto): Promise<User> {
    const user = await this.authService.validateUser(payload.userId);
    if (payload.exp * 1000 < Date.now()) {
      this.logger.log(`User token expired`);
      throw new UnauthorizedException('Token expired');
    }

    if (!user) {
      this.logger.log(`User ${user.email} not found`);
      throw new UnauthorizedException('Access Token Not Valid');
    }

    this.logger.log(`User ${user.email} validated`);

    return user;
  }
}
