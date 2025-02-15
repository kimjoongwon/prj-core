import { Group as GroupEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Service } from './service.entity';
import { Association } from './association.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { GroupDto } from '../dtos';
import { Tenant } from './tenant.entity';

@UseDto(GroupDto)
export class Group extends AbstractEntity<GroupDto> implements GroupEntity {
  name: string;
  label: string;
  tenantId: string;
  serviceId: string;

  associations?: Association[];
  service?: Service;
  tenant: Tenant;
}
