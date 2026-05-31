import { DateFieldOptional, EnumFieldOptional } from "@cocrepo/decorator";
import { ReservationStatus } from "@cocrepo/prisma";
import { QueryDto } from "../query/query.dto";

export class QueryMyReservationsDto extends QueryDto {
	@DateFieldOptional({ description: "조회 시작 시각" })
	from?: Date;

	@DateFieldOptional({ description: "조회 종료 시각" })
	to?: Date;

	@EnumFieldOptional(() => ReservationStatus, { description: "예약 상태" })
	status?: ReservationStatus;
}
