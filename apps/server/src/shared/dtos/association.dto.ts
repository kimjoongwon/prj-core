import { Association } from '@prisma/client';
import { ClassField, UUIDField } from '../decorators/field.decorators';
import { AbstractDto } from './abstract.dto';
import { GroupDto } from './group.dto';
import { UserDto } from './user.dto';
import { ServiceDto } from './service.dto';
import { TenancyDto } from './tenancy.dto';

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
