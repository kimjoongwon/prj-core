import { Injectable, Logger } from '@nestjs/common';
import { RolesRepository } from '../../entities/roles/roles.repository';

@Injectable()
export class RoleService {
  logger = new Logger(RoleService.name);
  LOG_PREFIX = `${RoleService.name}`;
  constructor(private readonly repository: RolesRepository) {}

  async initRole() {
    this.logger.log(`[${this.LOG_PREFIX}] 앱시작 ROLE 생성`);

    const superAdminRole = await this.repository.findUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민 생성`);

      await this.repository.create({ data: { name: 'SUPER_ADMIN' } });
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민이 이미 존재합니다.`);
    }

    this.logger.log(`[${this.LOG_PREFIX}] USER ROLE 생성`);

    const userRole = await this.repository.findUnique({ where: { name: 'USER' } });

    if (!userRole) {
      this.logger.log(`[${this.LOG_PREFIX}] USER 생성`);

      await this.repository.create({ data: { name: 'USER' } });
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] USER가 이미 존재합니다.`);
    }
  }

  getUserRole() {
    return this.repository.findUnique({ where: { name: 'USER' } });
  }
}
