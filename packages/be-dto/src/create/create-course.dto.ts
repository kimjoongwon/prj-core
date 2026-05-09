import {
	EnumFieldOptional,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { CourseStatus } from "@cocrepo/prisma";

export class CreateCourseDto {
	@UUIDField({ description: "소속 Space ID" })
	spaceId!: string;

	@StringField({ description: "코스명", minLength: 1, maxLength: 120 })
	name!: string;

	@StringFieldOptional({
		description: "코스 설명",
		maxLength: 2000,
		nullable: true,
	})
	description?: string | null;

	@NumberFieldOptional({
		description: "기본 수강 기간(개월)",
		int: true,
		min: 1,
		default: 6,
	})
	durationMonths?: number;

	@NumberFieldOptional({
		description: "기본 결제 금액",
		int: true,
		min: 0,
		default: 0,
	})
	basePriceAmount?: number;

	@StringFieldOptional({
		description: "결제 통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
		default: "KRW",
	})
	currency?: string;

	@EnumFieldOptional(() => CourseStatus, {
		description: "코스 상태",
		default: CourseStatus.DRAFT,
	})
	status?: CourseStatus;
}
