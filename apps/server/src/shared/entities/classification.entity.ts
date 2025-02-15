import { Classification as ClassificationEntity, Content, Timeline } from '@prisma/client';
import { Service } from './service.entity';
import { AbstractEntity } from './abstract.entity';
import { Category } from './category.entity';
import { User } from './user.entity';
import { Space } from './space.entity';
import { ClassificationDto } from '../dtos';
import { UseDto } from '../decorators/use-dto.decorator';
import { Role } from './role.entity';

@UseDto(ClassificationDto)
export class Classification
  extends AbstractEntity<ClassificationDto>
  implements ClassificationEntity
{
  categoryId: string;

  userId: string;
  contentId: string;
  spaceId: string;
  roleId: string;
  timelineId: string;

  serviceId: string;

  service: Service;
  category?: Category;
  user?: User;
  content?: Content;
  role?: Role;
  space?: Space;
  timeline?: Timeline;
}
