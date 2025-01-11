import { Association } from '@prisma/client';
import { ClassField, UUIDField } from '../decorators/field.decorators';
import { AbstractDto, GroupDto, UserDto, ServiceDto, TenancyDto } from '.';

export class AssociationDto extends AbstractDto implements Association {
  @UUIDField()
  tenancyId: string;

  @UUIDField({ nullable: true, required: false })
  groupId: string | null;

  @UUIDField({ nullable: true, required: false })
  userId: string | null;

  @UUIDField({ nullable: true, required: false })
  spaceId: string | null;

  @UUIDField({ nullable: true, required: false })
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
}
