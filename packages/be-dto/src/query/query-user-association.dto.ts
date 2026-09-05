import { EntityQueryType } from "./entity-query-type";
import { UserAssociation } from "@cocrepo/entity";

export class QueryUserAssociationDto extends EntityQueryType(UserAssociation, [
	"userId",
	"groupId",
] as const) {
}
