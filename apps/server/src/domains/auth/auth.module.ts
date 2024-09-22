import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import {
  RoleModule,
  SpaceModule,
  SpaceService,
  TenancyModule,
  TenantModule,
  TokenService,
  UserModule,
} from '@shared';

import { PasswordService } from './services';
import { SignUpPayloadDto } from './dtos';
import { LocalStrategy } from './strategies';

@Module({
  imports: [UserModule, RoleModule, TenancyModule, SpaceModule, TenantModule, PassportModule],
  controllers: [AuthController],
  providers: [TokenService, PasswordService, AuthService, LocalStrategy],
})
export class AuthModule implements OnModuleInit {
  logger: Logger = new Logger(AuthModule.name);
  LOG_PREFIX = `${AuthModule.name} DB_INIT`;
  constructor(
    private readonly authService: AuthService,
    private readonly spaceService: SpaceService,
  ) {}

  async onModuleInit() {
    this.logger.verbose(`[${this.LOG_PREFIX}] Create SUPER_ADMIN Role`);
    await this.authService.createInitRoles();

    this.logger.verbose(`[${this.LOG_PREFIX}] Create Base Space`);

    const galaxySpace = await this.spaceService.createOrUpdateGalaxySpace();

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
