import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { RolesService } from '@shared';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule implements OnModuleInit {
  logger: Logger = new Logger(RolesModule.name);
  LOG_PREFIX = `${RolesModule.name} DB_INIT`;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rolesService: RolesService,
  ) {}

  async onModuleInit() {
    this.logger.log(`[${this.LOG_PREFIX}] Create SUPER_ADMIN Role`);
    const superAdminRole = await this.prisma.role.findFirst({
      where: {
        name: 'SUPER_ADMIN',
      },
    });

    this.logger.log(`[${this.LOG_PREFIX}] Create USER Role`);
    const userRole = await this.prisma.role.findFirst({
      where: {
        name: 'USER',
      },
    });

    if (!superAdminRole) {
      this.logger.log('Create SUPER_ADMIN Role');
      await this.rolesService.createSuperAdmin();
    }

    if (!userRole) {
      this.logger.log('Create USER Role');
      await this.rolesService.createUser();
    }
  }
}
