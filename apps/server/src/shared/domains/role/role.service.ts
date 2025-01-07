import { Injectable, Logger } from '@nestjs/common';
import { RolesRepository } from '../../repositories/roles.repository';

@Injectable()
export class RoleService {
  logger = new Logger(RoleService.name);
  LOG_PREFIX = `${RoleService.name}`;
  constructor(private readonly repository: RolesRepository) {}

  getUserRole() {
    return this.repository.findUnique({ where: { name: 'USER' } });
  }
}
