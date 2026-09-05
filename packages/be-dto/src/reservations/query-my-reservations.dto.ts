import { DateFieldOptional } from "@cocrepo/decorator/field";
import { EntityQueryType } from "../query/entity-query-type";
import { Reservation } from "@cocrepo/entity";

export class QueryMyReservationsDto extends EntityQueryType(Reservation, [
	"status",
] as const) {
	@DateFieldOptional({ description: "조회 시작 시각" })
	from?: Date;

	@DateFieldOptional({ description: "조회 종료 시각" })
	to?: Date;

}
