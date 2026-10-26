import { EntityQueryType } from "./entity-query-type";
import { SpaceAssociation } from "@cocrepo/entity";

export class QuerySpaceAssociationDto extends EntityQueryType(SpaceAssociation, [
	"spaceId",
	"groupId",
] as const) {
}
