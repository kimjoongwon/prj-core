import { Association } from '@prisma/client';
import { ClassField, UUIDField, UUIDFieldOptional } from '../decorators/field.decorators';
import { AbstractDto, GroupDto, UserDto, ServiceDto, TenancyDto, RoutineDto } from '.';

export class AssociationDto extends AbstractDto implements Association {
  @UUIDField()
  tenancyId: string;

  @UUIDFieldOptional({ nullable: true })
  routineId: string;

  @UUIDFieldOptional({ nullable: true })
  groupId: string | null;

  @UUIDFieldOptional({ nullable: true })
  userId: string | null;

  @UUIDFieldOptional({ nullable: true })
  spaceId: string | null;

  @UUIDFieldOptional({ nullable: true })
  postId: string | null;

  @UUIDField()
  serviceId: string;

  @ClassField(() => TenancyDto, { required: false, swagger: false })
  tenancy?: TenancyDto;

  @ClassField(() => GroupDto, { required: false, swagger: false })
  group?: GroupDto;

  @ClassField(() => UserDto, { required: false, swagger: false })
  user?: GroupDto;

  @ClassField(() => ServiceDto, { required: false, swagger: false })
  service?: ServiceDto;

  @ClassField(() => RoutineDto, { required: false, swagger: false })
  routine?: RoutineDto;
}
