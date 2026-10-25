import { SpaceAssociation } from "@cocrepo/entity";
import { EntityQueryType } from "./entity-query-type";

export class QuerySpaceAssociationDto extends EntityQueryType(
	SpaceAssociation,
	[] as const,
) {}
