import { Association } from '@prisma/client';
import { ClassField, UUIDField } from '../decorators/field.decorators';
import { AbstractDto, GroupDto, UserDto, ServiceDto, TenancyDto } from '.';

export class AssociationDto extends AbstractDto implements Association {
  @UUIDField()
  tenancyId: string;

  @UUIDField({ nullable: true })
  groupId: string | null;

  @UUIDField({ nullable: true })
  userId: string | null;

  @UUIDField({ nullable: true })
  spaceId: string | null;

  @UUIDField()
  serviceId: string;

  @UUIDField({ nullable: true })
  postId: string | null;

  @ClassField(() => TenancyDto, { required: false })
  tenancy?: TenancyDto;

  @ClassField(() => GroupDto, { required: false })
  group?: GroupDto;

  @ClassField(() => UserDto, { required: false })
  user?: GroupDto;

  @ClassField(() => ServiceDto, { required: false })
  service?: ServiceDto;
}
