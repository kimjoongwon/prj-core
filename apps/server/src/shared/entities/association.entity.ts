import { Association as AssociationEntity, Content } from '@prisma/client';
import { User } from './user.entity';
import { Service } from './service.entity';
import { AbstractEntity } from './abstract.entity';
import { Space } from './space.entity';
import { Tenancy } from './tenancy.entity';
import { Group } from './group.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { AssociationDto } from '../dtos';
import { Timeline } from './timeline.entity';

@UseDto(AssociationDto)
export class Association extends AbstractEntity<AssociationDto> implements AssociationEntity {
  contentId: string | null;
  roleId: string | null;
  timelineId: string | null;
  groupId: string;
  userId: string | null;
  spaceId: string | null;
  serviceId: string;

  group?: Group;
  user?: User;
  space?: Space;
  timeline?: Timeline;
  content?: Content;
  service?: Service;
}
