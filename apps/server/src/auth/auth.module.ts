import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from './auth.constants';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { SpacesModule } from 'src/spaces/spaces.module';
import { TenantsModule } from 'src/tenants/tenants.module';
import { RolesModule } from 'src/roles/roles.module';
import { PasswordService } from './password.service';

@Module({
  imports: [
    RolesModule,
    SpacesModule,
    TenantsModule,
    UsersModule,
    ProfilesModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
