import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { TenantDto } from '../../tenants';
import { Role } from '../role.entity';
import {
  ClassField,
  EnumField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';

export class RoleDto extends AbstractDto implements Role {
  @StringField({ each: true, default: [] })
  assignmentIds: string[];

  @UUIDField({ nullable: true })
  classificationId: string | null;

  @EnumField(() => $Enums.Roles)
  name: $Enums.Roles;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
