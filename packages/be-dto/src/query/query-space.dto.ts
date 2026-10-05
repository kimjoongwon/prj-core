import { StringFieldOptional } from "@cocrepo/decorator/field";
import { Space } from "@cocrepo/entity";
import { EntityQueryType } from "./entity-query-type";

export class QuerySpaceDto extends EntityQueryType(Space, [
	"contentLanguageCode",
] as const) {
	@StringFieldOptional()
	search?: string;
}
