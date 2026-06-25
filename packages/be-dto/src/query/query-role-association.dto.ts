import { UUIDFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryRoleAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	roleId?: string;

	@UUIDFieldOptional()
	groupId?: string;
}
