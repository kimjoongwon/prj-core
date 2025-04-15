import { Association as AssociationEntity, Content, File } from '@prisma/client';
import { User } from './user.entity';
import { Service } from './service.entity';
import { AbstractEntity } from './abstract.entity';
import { Space } from './space.entity';
import { Group } from './group.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { Timeline } from './timeline.entity';
import { Task } from './task.entity';
import { AssociationDto } from '../dtos/association.dto';

@UseDto(AssociationDto)
export class Association extends AbstractEntity<AssociationDto> implements AssociationEntity {
  taskId: string;
  fileId: string | null;
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
  file?: File;
  taks?: Task;
}
