import { EntityQueryType } from "./entity-query-type";
import { UserAssociation } from "@cocrepo/entity";

export class QueryUserAssociationDto extends EntityQueryType(UserAssociation, [
	"userSeq",
	"groupSeq",
] as const) {
}
