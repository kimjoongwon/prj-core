import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordService } from './providers/password.service';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from '../../common/guards';
import { AuthConfig } from '../../configs';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const authConfig = configService.get<AuthConfig>('auth');
        return {
          secret: authConfig.secret,
          signOptions: { expiresIn: authConfig.expires },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GqlAuthGuard,
    AuthResolver,
    PasswordService,
  ],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
