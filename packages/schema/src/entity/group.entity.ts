import { Group as GroupEntity, GroupTypes } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { GroupDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";
import { Tenant } from "./tenant.entity";

@UseDto(GroupDto)
export class Group extends AbstractEntity<GroupDto> implements GroupEntity {
	name: string;
	label: string;
	type: GroupTypes;
	tenantId: string;
	tenant: Tenant;
}
