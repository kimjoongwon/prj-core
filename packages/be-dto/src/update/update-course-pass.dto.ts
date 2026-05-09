import {
	DateFieldOptional,
	EnumFieldOptional,
	NumberFieldOptional,
} from "@cocrepo/decorator";
import { CoursePassKind, CoursePassStatus } from "@cocrepo/prisma";

export class UpdateCoursePassDto {
	@EnumFieldOptional(() => CoursePassKind, { description: "수강권 종류" })
	kind?: CoursePassKind;

	@DateFieldOptional({ description: "수강권 유효 시작일" })
	validFrom?: Date;

	@DateFieldOptional({ description: "수강권 만료일" })
	expiresAt?: Date;

	@NumberFieldOptional({ description: "예약 가능 횟수", int: true, min: 0 })
	reservationLimit?: number;

	@NumberFieldOptional({ description: "사용한 예약 횟수", int: true, min: 0 })
	reservationUsedCount?: number;

	@NumberFieldOptional({ description: "남은 예약 횟수", int: true, min: 0 })
	reservationRemainingCount?: number;

	@EnumFieldOptional(() => CoursePassStatus, { description: "수강권 상태" })
	status?: CoursePassStatus;
}
