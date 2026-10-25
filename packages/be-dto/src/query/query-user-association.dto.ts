import { UserAssociation } from "@cocrepo/entity";
import { EntityQueryType } from "./entity-query-type";

export class QueryUserAssociationDto extends EntityQueryType(
	UserAssociation,
	[] as const,
) {}
