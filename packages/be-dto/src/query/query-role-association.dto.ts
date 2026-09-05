import { EntityQueryType } from "./entity-query-type";
import { RoleAssociation } from "@cocrepo/entity";

export class QueryRoleAssociationDto extends EntityQueryType(RoleAssociation, [
	"roleId",
	"groupId",
] as const) {
}
