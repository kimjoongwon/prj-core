import { $Enums, Ability } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { JsonValue } from '@prisma/client/runtime/library';
import { ClassField, EnumField, StringFieldOptional, UUIDField } from '../decorators';
import { TenantDto } from './tenant.dto';

export class AbilityDto extends AbstractDto implements Ability {
  @UUIDField()
  tenantId: string;

  @UUIDField()
  actionId: string;

  @StringFieldOptional({ nullable: true })
  conditions: JsonValue | null;

  @UUIDField()
  subjectId: string;

  @EnumField(() => $Enums.AbilityTypes)
  type: $Enums.AbilityTypes;

  @UUIDField()
  roleId: string;

  @StringFieldOptional({ nullable: true })
  description: string | null;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
