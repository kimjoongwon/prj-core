import { UUIDFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QuerySpaceAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	spaceId?: string;

	@UUIDFieldOptional()
	groupId?: string;
}
