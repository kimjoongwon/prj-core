import { UUIDFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryUserAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	userId?: string;

	@UUIDFieldOptional()
	groupId?: string;
}
