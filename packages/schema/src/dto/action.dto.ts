import { Action, AbilityActions } from "@prisma/client";
import { JsonValue } from "../types/json";
import {
	ClassField,
	EnumField,
	StringFieldOptional,
	UUIDField,
} from "../decorator";
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
