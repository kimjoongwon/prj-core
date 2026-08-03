import { BigIntIdFieldOptional } from "@cocrepo/decorator/field";
import { QueryDto } from "./query.dto";

export class QuerySpaceAssociationDto extends QueryDto {
	@BigIntIdFieldOptional()
	spaceId?: bigint;

	@BigIntIdFieldOptional()
	groupId?: bigint;
}
