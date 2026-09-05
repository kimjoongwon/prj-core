import { Role } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { RoleAssignmentResponseDto } from "./role-assignments";
import { RoleAssociationDto } from "./role-association.dto";
import { RoleClassificationDto } from "./role-classification.dto";

export class RoleDto extends EntityResponseType(Role, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"name",
		"displayName",
		"description",
		"classification",
		"associations",
		"assignments",
	] as const,
	relations: {
		classification: () => RoleClassificationDto,
		associations: () => RoleAssociationDto,
		assignments: () => RoleAssignmentResponseDto,
	},
}) {
	declare classification?: RoleClassificationDto;
	declare associations?: RoleAssociationDto[];
	declare assignments?: RoleAssignmentResponseDto[];
}
