import {
	ClassField,
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { type Course, CourseStatus } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { CourseOfferingDto } from "./course-offering.dto";
import { CoursePassDto } from "./course-pass.dto";
import { EnrollmentDto } from "./enrollment.dto";
import { TenantDto } from "./tenant.dto";

export class CourseDto extends AbstractDto implements Course {
	@UUIDField({ description: "소속 Tenant ID" })
	tenantId!: string;

	@StringField({ description: "코스명", minLength: 1, maxLength: 120 })
	name!: string;

	@StringFieldOptional({
		description: "코스 설명",
		maxLength: 2000,
		nullable: true,
	})
	description!: string | null;

	@NumberField({ description: "기본 수강 기간(개월)", int: true, min: 1 })
	durationMonths!: number;

	@NumberField({ description: "기본 결제 금액", int: true, min: 0 })
	basePriceAmount!: number;

	@StringField({
		description: "결제 통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
	})
	currency!: string;

	@EnumField(() => CourseStatus, { description: "코스 상태" })
	status!: CourseStatus;

	@NumberField({ description: "활성 개설 수", int: true, min: 0 })
	activeOfferingCount!: number;

	@NumberField({ description: "활성 수강 등록 수", int: true, min: 0 })
	activeEnrollmentCount!: number;

	@ClassField(() => TenantDto, {
		description: "소속 Tenant",
		required: false,
	})
	tenant?: TenantDto;

	@ClassField(() => CourseOfferingDto, {
		description: "코스 개설 목록",
		each: true,
		isArray: true,
		required: false,
	})
	offerings?: CourseOfferingDto[];

	@ClassField(() => EnrollmentDto, {
		description: "수강 등록 목록",
		each: true,
		isArray: true,
		required: false,
	})
	enrollments?: EnrollmentDto[];

	@ClassField(() => CoursePassDto, {
		description: "수강권 목록",
		each: true,
		isArray: true,
		required: false,
	})
	passes?: CoursePassDto[];
}
