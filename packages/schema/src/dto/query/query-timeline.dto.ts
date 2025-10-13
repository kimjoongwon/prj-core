import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { QueryDto } from "./query.dto";

export class QueryTimelineDto extends QueryDto {
	// @UUIDFieldOptional({ nullable: true, default: null })
	@IsOptional()
	@Transform(({ value }) => (value === "null" ? null : value))
	timelineId: string | null;
}
