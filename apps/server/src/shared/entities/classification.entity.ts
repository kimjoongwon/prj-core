import { Classification as ClassificationEntity } from '@prisma/client';
import { Service } from './service.entity';
import { AbstractEntity } from './abstract.entity';
import { Category } from './category.entity';
import { User } from './user.entity';
// import { Post } from './post.entity';
// import { Role } from './role.entity';
import { Space } from './space.entity';
import { Tenancy } from './tenancy.entity';
import { ClassificationDto } from '../dtos';
import { UseDto } from '../decorators/use-dto.decorator';

@UseDto(ClassificationDto)
export class Classification
  extends AbstractEntity<ClassificationDto>
  implements ClassificationEntity
{
  categoryId: string;
  userId: string | null;
  postId: string | null;
  roleId: string | null;
  spaceId: string | null;
  serviceId: string;
  tenancyId: string;

  service: Service;
  tenancy?: Tenancy;
  category?: Category;
  users?: User[];
  // roles?: Role[];
  // posts?: Post[];
  spaces?: Space[];
}
