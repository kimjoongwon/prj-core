import { Timeline } from "@prisma/client";
import { ClassField, UUIDField } from "../decorator/field.decorators";
import { AbstractDto } from "./abstract.dto";
import { TenantDto } from "./tenant.dto";

export class TimelineDto extends AbstractDto implements Timeline {
	@UUIDField()
	tenantId: string;

	@ClassField(() => TenantDto)
	tenant?: TenantDto;
}
