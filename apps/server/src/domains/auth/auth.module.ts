import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import {
  AuthConfig,
  PasswordService,
  RolesService,
  SpacesService,
  UsersService,
} from '@shared';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        const authConfig = await config.get<AuthConfig>('auth');
        return {
          secret: authConfig?.secret,
          signOptions: { expiresIn: authConfig?.expires },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    RolesService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    PasswordService,
    SpacesService,
    AuthService,
  ],
})
export class AuthModule {}
