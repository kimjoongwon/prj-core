import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import {
  AuthConfig,
  RolesService,
  SpacesService,
  TenanciesService,
  TenantsModule,
  TokenService,
  UsersService,
} from '@shared';

import { PasswordService } from './services';
import { JwtStrategy, LocalStrategy } from './strategies';
import { SignUpPayloadDto } from './dtos';

@Module({
  imports: [
    TenantsModule,
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
    TenanciesService,
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
export class AuthModule implements OnModuleInit {
  logger: Logger = new Logger(AuthModule.name);
  LOG_PREFIX = `${AuthModule.name} DB_INIT`;
  constructor(private readonly authService: AuthService) {}

  async onModuleInit() {
    this.logger.verbose(`[${this.LOG_PREFIX}] Create SUPER_ADMIN Role`);
    await this.authService.createInitRoles();

    this.logger.verbose(`[${this.LOG_PREFIX}] Create Base Space`);
    const galaxySpace = await this.authService.createGalaxySpace();

    const signUpPayloadDto: SignUpPayloadDto = {
      email: 'galaxy@gmail.com',
      name: '관리자',
      phone: '01073162347',
      password: 'rkdmf12!@',
      spaceId: galaxySpace.id,
      nickname: 'Wally',
    };

    this.authService.createSuperAdmin(signUpPayloadDto);
  }
}
