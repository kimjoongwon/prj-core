import { UserClassification as UserClassificationEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Category } from './category.entity';
import { User } from './user.entity';
import { UserClassificationDto } from '../dto';
import { UseDto } from '../decorator/use-dto.decorator';

@UseDto(UserClassificationDto)
export class UserClassification
  extends AbstractEntity<UserClassificationDto>
  implements UserClassificationEntity
{
  categoryId: string;
  userId: string;

  category?: Category;
  user?: User;
}
