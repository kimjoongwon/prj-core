import {
	BigIntIdValidation,
	BooleanValidation,
	DateValidation,
	NumberValidation,
	StringValidation,
	ULIDValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** UserStatus의 DB 필드 타입과 공통 검증입니다. */
export class UserStatusSchema extends AbstractSchema {
	@ULIDValidation()
	userStatusId!: string;

	@BigIntIdValidation()
	userId!: bigint;

	@BooleanValidation({ description: "활성 상태" })
	isActive!: boolean;

	@NumberValidation({ description: "로그인 실패 횟수" })
	failedLoginAttempts!: number;

	@DateValidation({ nullable: true, description: "잠금 해제 시각" })
	lockedUntil!: Date | null;

	@BooleanValidation({ description: "영구 잠금 여부" })
	isPermanentlyLocked!: boolean;

	@DateValidation({ nullable: true, description: "마지막 로그인 시각" })
	lastLoginAt!: Date | null;

	@StringValidation({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: string | null;

	@BigIntIdValidation({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	currentTenantId!: bigint | null;
}
