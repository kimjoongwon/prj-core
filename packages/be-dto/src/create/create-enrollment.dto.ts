import {
	DateFieldOptional,
	EnumFieldOptional,
	NumberFieldOptional,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { EnrollmentStatus, PaymentStatus } from "@cocrepo/prisma";

export class CreateEnrollmentDto {
	@UUIDField({ description: "수강 사용자 ID" })
	userId!: string;

	@UUIDField({ description: "코스 ID" })
	courseId!: string;

	@UUIDField({ description: "코스 개설 ID" })
	courseOfferingId!: string;

	@UUIDFieldOptional({ description: "배정 Timeline ID", nullable: true })
	assignedTimelineId?: string | null;

	@UUIDFieldOptional({ description: "결제 ID", nullable: true })
	paymentId?: string | null;

	@EnumFieldOptional(() => PaymentStatus, {
		description: "결제 상태",
		default: PaymentStatus.PENDING,
	})
	paymentStatus?: PaymentStatus;

	@StringFieldOptional({
		description: "결제 제공자",
		maxLength: 80,
		nullable: true,
	})
	paymentProvider?: string | null;

	@StringFieldOptional({
		description: "외부 결제 식별자",
		maxLength: 160,
		nullable: true,
	})
	paymentExternalId?: string | null;

	@DateFieldOptional({ description: "결제 완료 시각", nullable: true })
	paidAt?: Date | null;

	@NumberFieldOptional({
		description: "결제 금액",
		int: true,
		min: 0,
		nullable: true,
	})
	paidAmount?: number | null;

	@StringFieldOptional({
		description: "결제 통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
		default: "KRW",
	})
	currency?: string;

	@DateFieldOptional({ description: "수강 유효 시작일", nullable: true })
	validFrom?: Date | null;

	@DateFieldOptional({ description: "수강 유효 종료일", nullable: true })
	validUntil?: Date | null;

	@EnumFieldOptional(() => EnrollmentStatus, {
		description: "수강 등록 상태",
		default: EnrollmentStatus.PENDING,
	})
	status?: EnrollmentStatus;
}
