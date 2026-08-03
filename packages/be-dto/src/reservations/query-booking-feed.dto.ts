import {
	BigIntIdFieldOptional,
	DateFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { QueryDto } from "../query/query.dto";

export class QueryBookingFeedDto extends QueryDto {
	@DateFieldOptional({ description: "조회 시작 일시" })
	dateFrom?: Date;

	@DateFieldOptional({ description: "조회 종료 일시" })
	dateTo?: Date;

	@StringFieldOptional({
		description: "클라이언트 표시 타임존",
		default: "Asia/Seoul",
	})
	timeZone?: string;

	@BigIntIdFieldOptional({ description: "타임라인 ID 필터" })
	timelineId?: bigint;

	@BigIntIdFieldOptional({ description: "프로그램 ID 필터" })
	programId?: bigint;

	@StringFieldOptional({ description: "프로그램/세션/타임라인 검색어" })
	search?: string;
}
