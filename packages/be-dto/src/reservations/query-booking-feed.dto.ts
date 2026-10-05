import { DateFieldOptional, StringFieldOptional } from "@cocrepo/decorator/field";
import { EntityQueryType } from "../query/entity-query-type";
import { Reservation } from "@cocrepo/entity";

export class QueryBookingFeedDto extends EntityQueryType(Reservation, [
	"timelineId",
	"programId",
] as const) {
	@DateFieldOptional({ description: "조회 시작 일시" })
	dateFrom?: Date;

	@DateFieldOptional({ description: "조회 종료 일시" })
	dateTo?: Date;

	@StringFieldOptional({
		description: "클라이언트 표시 타임존",
		default: "Asia/Seoul",
	})
	timeZone?: string;

	@StringFieldOptional({ description: "프로그램/세션/타임라인 검색어" })
	search?: string;
}
