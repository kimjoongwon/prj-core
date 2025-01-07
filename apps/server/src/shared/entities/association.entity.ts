import { Association as AssociationEntity } from '@prisma/client';
import { User } from './user.entity';
import { Service } from './service.entity';
import { AbstractEntity } from './abstract.entity';
import { Space } from './space.entity';
import { Tenancy } from './tenancy.entity';
import { Group } from './group.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { AssociationDto } from '../dtos';

@UseDto(AssociationDto)
export class Association extends AbstractEntity<AssociationDto> implements AssociationEntity {
  groupId: string;
  userId: string | null;
  spaceId: string | null;
  serviceId: string;
  tenancyId: string;

  group?: Group;
  user?: User;
  space?: Space;
  service?: Service;
  tenancy?: Tenancy;
}
