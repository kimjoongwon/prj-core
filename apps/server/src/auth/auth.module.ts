import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { SpacesModule } from 'src/spaces/spaces.module';
import { TenantsModule } from 'src/tenants/tenants.module';
import { RolesModule } from 'src/roles/roles.module';
import { PasswordService } from './password.service';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'src/configs';

@Module({
  imports: [
    RolesModule,
    SpacesModule,
    TenantsModule,
    UsersModule,
    ProfilesModule,
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
    // JwtModule.registerAsync({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '60s' },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
