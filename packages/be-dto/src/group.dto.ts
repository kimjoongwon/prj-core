import {
	ClassField,
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Group } from "@cocrepo/prisma";
import { GroupTypes } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { TenantDto } from "./tenant.dto";

export class GroupDto extends AbstractDto implements Group {
	@UUIDField()
	tenantId!: string;

	@StringField()
	name!: string;

	@StringFieldOptional({ nullable: true })
	label!: string | null;

	@EnumField(() => GroupTypes, { required: true })
	type!: GroupTypes;

	@UUIDFieldOptional()
	creatorId!: string | null;

	@ClassField(() => TenantDto, { required: false })
	tenant?: TenantDto;
}
