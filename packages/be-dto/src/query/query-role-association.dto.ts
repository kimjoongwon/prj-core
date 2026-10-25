import { RoleAssociation } from "@cocrepo/entity";
import { EntityQueryType } from "./entity-query-type";

export class QueryRoleAssociationDto extends EntityQueryType(
	RoleAssociation,
	[] as const,
) {}
