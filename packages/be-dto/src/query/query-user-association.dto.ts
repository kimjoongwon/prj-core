import { ULIDFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryUserAssociationDto extends QueryDto {
	@ULIDFieldOptional()
	userId?: string;

	@ULIDFieldOptional()
	groupId?: string;
}
