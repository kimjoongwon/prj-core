import { Classification } from '@prisma/client';
import { ClassField, UUIDField } from '../decorators';
import { SpaceDto, UserDto, AbstractDto, CategoryDto, TenancyDto } from '.';

export class ClassificationDto extends AbstractDto implements Classification {
  @UUIDField()
  tenancyId: string;

  @UUIDField({ nullable: true, default: null })
  userId: string | null;

  @UUIDField({ nullable: true, default: null })
  postId: string | null;

  @UUIDField({ nullable: true, default: null })
  spaceId: string | null;

  @UUIDField({ nullable: true, default: null })
  roleId: string | null;

  @UUIDField()
  categoryId: string;

  @UUIDField()
  serviceId: string;

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;

  @ClassField(() => TenancyDto, { required: false })
  tenancy?: TenancyDto;

  @ClassField(() => UserDto, { required: false, each: true })
  users?: UserDto[];

  @ClassField(() => SpaceDto, { required: false, each: true })
  spaces?: SpaceDto[];
}
