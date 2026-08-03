import { BigIntIdFieldOptional } from "@cocrepo/decorator/field";
import { QueryDto } from "./query.dto";

export class QueryRoleAssociationDto extends QueryDto {
	@BigIntIdFieldOptional()
	roleId?: bigint;

	@BigIntIdFieldOptional()
	groupId?: bigint;
}
