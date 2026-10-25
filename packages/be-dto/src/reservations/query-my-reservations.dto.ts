import { DateFieldOptional } from "@cocrepo/decorator/field";
import { Reservation } from "@cocrepo/entity";
import { EntityQueryType } from "../query/entity-query-type";

export class QueryMyReservationsDto extends EntityQueryType(Reservation, [
	"status",
] as const) {
	@DateFieldOptional({ description: "조회 시작 시각" })
	from?: Date;

	@DateFieldOptional({ description: "조회 종료 시각" })
	to?: Date;
}
