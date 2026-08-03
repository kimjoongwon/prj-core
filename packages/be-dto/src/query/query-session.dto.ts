import { BigIntIdFieldOptional } from "@cocrepo/decorator/field";
import { QueryDto } from "./query.dto";

export class QuerySessionDto extends QueryDto {
	@BigIntIdFieldOptional({ nullable: true, default: null })
	timelineId?: bigint | null;
}
