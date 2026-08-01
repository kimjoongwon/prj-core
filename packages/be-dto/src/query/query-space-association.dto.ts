import { ULIDFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QuerySpaceAssociationDto extends QueryDto {
	@ULIDFieldOptional()
	spaceId?: string;

	@ULIDFieldOptional()
	groupId?: string;
}
