import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { AuthConfig, RolesService, SpacesService, TokenService, UsersService } from '@shared';

import { PasswordService } from './services';

import { JwtStrategy, LocalStrategy } from './strategies';

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
    TokenService,
    PasswordService,
    RolesService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    SpacesService,
    AuthService,
  ],
})
export class AuthModule {}
