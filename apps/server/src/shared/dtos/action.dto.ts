import { $Enums, Action } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { JsonValue } from '@prisma/client/runtime/library';
import { ClassField, EnumField, StringFieldOptional, UUIDField } from '../decorators';
import { TenantDto } from './tenant.dto';

export class ActionDto extends AbstractDto implements Action {
  @UUIDField()
  tenantId: string;

  @EnumField(() => $Enums.AbilityActions)
  name: $Enums.AbilityActions;

  @StringFieldOptional()
  conditions: JsonValue | null;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
