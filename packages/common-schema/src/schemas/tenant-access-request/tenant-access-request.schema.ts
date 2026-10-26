import { TenantAccessRequestStatus } from "@cocrepo/enum";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	DateValidation,
	EnumValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** TenantAccessRequest의 DB 필드 타입과 공통 검증입니다. */
export class TenantAccessRequestSchema
	extends AbstractSchema
{
	tenantAccessRequestId!: string;

	@BigIntIdValidation({ description: "신청자 ID" })
	requesterId!: bigint;

	@BigIntIdValidation({ description: "신청 대상 Space ID" })
	spaceId!: bigint;

	@BigIntIdValidation({ description: "희망 Role ID" })
	requestedRoleId!: bigint;

	@BigIntIdValidationOptional({
		description: "신청 시점 기존 Role ID",
		nullable: true,
	})
	previousRoleId!: bigint | null;

	@StringValidationOptional({ description: "신청 사유", nullable: true })
	reason!: string | null;

	@EnumValidation(() => TenantAccessRequestStatus, { description: "신청 상태" })
	status!: TenantAccessRequestStatus;

	@BigIntIdValidationOptional({ description: "검토자 ID", nullable: true })
	reviewerId!: bigint | null;

	@StringValidationOptional({ description: "검토 코멘트", nullable: true })
	reviewComment!: string | null;

	@DateValidation({ description: "검토 시각", nullable: true })
	reviewedAt!: Date | null;

	@BigIntIdValidationOptional({
		description: "승인 적용 Tenant ID",
		nullable: true,
	})
	appliedTenantId!: bigint | null;
}
