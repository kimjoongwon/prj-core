import { ULIDFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryRoleAssociationDto extends QueryDto {
	@ULIDFieldOptional()
	roleId?: string;

	@ULIDFieldOptional()
	groupId?: string;
}
