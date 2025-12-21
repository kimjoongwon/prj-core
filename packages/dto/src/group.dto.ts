import type { Group } from "@prisma/client";
import { GroupTypes } from "@prisma/client";
import {
	ClassField,
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { AbstractDto } from "./abstract.dto";
import { TenantDto } from "./tenant.dto";

export class GroupDto extends AbstractDto implements Group {
	@StringField()
	name!: string;

	@StringFieldOptional({ nullable: true })
	label!: string | null;

	@EnumField(() => GroupTypes, { required: true })
	type!: GroupTypes;

	@UUIDField()
	tenantId!: string;

	@ClassField(() => TenantDto, { required: false })
	tenant?: TenantDto;
}
