import { UserClassification } from '@prisma/client';
import { ClassField, UUIDFieldOptional } from '../decorator';
import { AbstractDto, UserDto } from '.';

export class UserClassificationDto extends AbstractDto implements UserClassification {
  @UUIDFieldOptional()
  categoryId: string;

  @UUIDFieldOptional()
  userId: string;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto[];
}
