import {
	DateFieldOptional,
	EnumFieldOptional,
	NumberFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { PaymentMethod, PaymentStatus, type Prisma } from "@cocrepo/prisma";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdatePaymentDto {
	@StringFieldOptional({ description: "결제명", minLength: 1, maxLength: 160 })
	title?: string;

	@EnumFieldOptional(() => PaymentStatus, { description: "결제 상태" })
	status?: PaymentStatus;

	@EnumFieldOptional(() => PaymentMethod, {
		description: "결제 수단",
		nullable: true,
	})
	method?: PaymentMethod | null;

	@StringFieldOptional({
		description: "결제 제공자",
		maxLength: 80,
		nullable: true,
	})
	provider?: string | null;

	@StringFieldOptional({
		description: "결제 제공자 결제 ID",
		maxLength: 160,
		nullable: true,
	})
	providerPaymentId?: string | null;

	@StringFieldOptional({
		description: "결제 제공자 주문 ID",
		maxLength: 160,
		nullable: true,
	})
	providerOrderId?: string | null;

	@NumberFieldOptional({
		description: "총 결제 금액",
		int: true,
		min: 0,
	})
	totalAmount?: number;

	@StringFieldOptional({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
	})
	currency?: string;

	@DateFieldOptional({ description: "결제 요청 시각", nullable: true })
	requestedAt?: Date | null;

	@DateFieldOptional({ description: "결제 승인 시각", nullable: true })
	approvedAt?: Date | null;

	@DateFieldOptional({ description: "결제 취소 시각", nullable: true })
	canceledAt?: Date | null;

	@StringFieldOptional({
		description: "영수증 URL",
		maxLength: 1000,
		nullable: true,
	})
	receiptUrl?: string | null;

	@StringFieldOptional({
		description: "관리 메모",
		maxLength: 1000,
		nullable: true,
	})
	memo?: string | null;

	@ApiPropertyOptional({
		description: "결제 metadata",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	@IsOptional()
	metadata?: Prisma.InputJsonValue | null;
}
