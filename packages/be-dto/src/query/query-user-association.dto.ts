import { BigIntIdFieldOptional } from "@cocrepo/decorator/field";
import { QueryDto } from "./query.dto";

export class QueryUserAssociationDto extends QueryDto {
	@BigIntIdFieldOptional()
	userId?: bigint;

	@BigIntIdFieldOptional()
	groupId?: bigint;
}
