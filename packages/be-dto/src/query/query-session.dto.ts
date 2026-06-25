import { StringFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QuerySessionDto extends QueryDto {
	@StringFieldOptional({ nullable: true, default: null })
	timelineId?: string | null;
}
