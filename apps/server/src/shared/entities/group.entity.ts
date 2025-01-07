import { Group as GroupEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Service } from './service.entity';
import { Association } from './association.entity';
import { Tenancy } from './tenancy.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { GroupDto } from '../dtos';

@UseDto(GroupDto)
export class Group extends AbstractEntity<GroupDto> implements GroupEntity {
  name: string;
  serviceId: string;
  tenancyId: string;

  service?: Service;
  associations?: Association[];
  tenancy?: Tenancy;
}
