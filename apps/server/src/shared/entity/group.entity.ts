import { $Enums, Group as GroupEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { UseDto } from '../decorator/use-dto.decorator';
import { GroupDto } from '../dto';
import { Tenant } from './tenant.entity';

@UseDto(GroupDto)
export class Group extends AbstractEntity<GroupDto> implements GroupEntity {
  name: string;
  label: string;
  type: $Enums.GroupTypes;
  tenantId: string;
  tenant: Tenant;
}
