import { RoleClassification as RoleClassificationEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Category } from './category.entity';
import { Role } from './role.entity';
import { RoleClassificationDto } from '../dto';
import { UseDto } from '../decorator/use-dto.decorator';

@UseDto(RoleClassificationDto)
export class RoleClassification
  extends AbstractEntity<RoleClassificationDto>
  implements RoleClassificationEntity
{
  categoryId: string;
  roleId: string;

  category?: Category;
  role?: Role;
}
