import { UserClassification } from '@prisma/client';
import { ClassField, UUIDField, UUIDFieldOptional } from '../decorator';
import { UserDto, AbstractDto, CategoryDto } from '.';

export class UserClassificationDto extends AbstractDto implements UserClassification {
  @UUIDFieldOptional({ nullable: true, default: null })
  userId: string | null;

  @UUIDField()
  categoryId: string;

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto[];
}
