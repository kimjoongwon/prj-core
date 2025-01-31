import { Classification } from '@prisma/client';
import { ClassField, UUIDField, UUIDFieldOptional } from '../decorators';
import { SpaceDto, UserDto, AbstractDto, CategoryDto, TenancyDto, RoutineDto } from '.';
import { Class } from 'effect/Request';

export class ClassificationDto extends AbstractDto implements Classification {
  @UUIDField()
  tenancyId: string;

  @UUIDFieldOptional({ nullable: true, default: null })
  routineId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  userId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  postId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  spaceId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  roleId: string | null;

  @UUIDField()
  categoryId: string;

  @UUIDField()
  serviceId: string;

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;

  @ClassField(() => TenancyDto, { required: false })
  tenancy?: TenancyDto;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto[];

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto[];

  @ClassField(() => RoutineDto, { required: false })
  routine?: RoutineDto[];
}
