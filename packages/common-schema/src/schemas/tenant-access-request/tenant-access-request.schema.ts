import { TenantAccessRequestStatus } from "@cocrepo/enum";
import type { TenantAccessRequest as PrismaTenantAccessRequest } from "@cocrepo/prisma";
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
	implements PrismaTenantAccessRequest
{
	tenantAccessRequestId!: PrismaTenantAccessRequest["tenantAccessRequestId"];

	@BigIntIdValidation({ description: "신청자 ID" })
	requesterId!: PrismaTenantAccessRequest["requesterId"];

	@BigIntIdValidation({ description: "신청 대상 Space ID" })
	spaceId!: PrismaTenantAccessRequest["spaceId"];

	@BigIntIdValidation({ description: "희망 Role ID" })
	requestedRoleId!: PrismaTenantAccessRequest["requestedRoleId"];

	@BigIntIdValidationOptional({
		description: "신청 시점 기존 Role ID",
		nullable: true,
	})
	previousRoleId!: PrismaTenantAccessRequest["previousRoleId"];

	@StringValidationOptional({ description: "신청 사유", nullable: true })
	reason!: PrismaTenantAccessRequest["reason"];

	@EnumValidation(() => TenantAccessRequestStatus, { description: "신청 상태" })
	status!: PrismaTenantAccessRequest["status"];

	@BigIntIdValidationOptional({ description: "검토자 ID", nullable: true })
	reviewerId!: PrismaTenantAccessRequest["reviewerId"];

	@StringValidationOptional({ description: "검토 코멘트", nullable: true })
	reviewComment!: PrismaTenantAccessRequest["reviewComment"];

	@DateValidation({ description: "검토 시각", nullable: true })
	reviewedAt!: PrismaTenantAccessRequest["reviewedAt"];

	@BigIntIdValidationOptional({
		description: "승인 적용 Tenant ID",
		nullable: true,
	})
	appliedTenantId!: PrismaTenantAccessRequest["appliedTenantId"];
}
