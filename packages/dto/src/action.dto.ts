import {
  ClassField,
  EnumField,
  StringFieldOptional,
  UUIDField,
} from "@cocrepo/decorator";
import { JsonValue } from "@cocrepo/entity";
import { AbilityActions, Action } from "@prisma/client";
import { AbstractDto } from "./abstract.dto";
import { TenantDto } from "./tenant.dto";

export class ActionDto extends AbstractDto implements Action {
  @UUIDField()
  tenantId: string;

  @EnumField(() => AbilityActions)
  name: AbilityActions;

  @StringFieldOptional()
  conditions: JsonValue | null;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
