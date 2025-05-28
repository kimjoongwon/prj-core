import { UserClassification } from '@prisma/client';
import { ClassField, UUIDFieldOptional } from '../decorator';
import { UserDto } from '.';
import { ClassificationDto } from './classification.dto';

export class UserClassificationDto extends ClassificationDto implements UserClassification {
  @UUIDFieldOptional({ nullable: true, default: null })
  userId: string | null;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto[];
}
