import {
	BigIntIdValidation,
	BooleanValidation,
	DateValidation,
	EmailValidation,
	NumberValidation,
	StoredStringValidation,
	StringValidation,
	ULIDValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** User의 DB 필드 타입과 공통 검증입니다. */
export class UserSchema extends AbstractSchema {
	@ULIDValidation()
	userId!: string;

	@StringValidation({ description: "연락처" })
	phone!: string;

	@StringValidation({ description: "사용자 이름" })
	name!: string;

	@EmailValidation({ description: "이메일 주소" })
	email!: string;

	@StoredStringValidation()
	password!: string;

	@NumberValidation({ description: "로그인 실패 횟수" })
	failedLoginAttempts!: number;

	@DateValidation({ nullable: true, description: "잠금 해제 시각" })
	lockedUntil!: Date | null;

	@BooleanValidation({ description: "영구 잠금 여부" })
	isPermanentlyLocked!: boolean;

	@BooleanValidation({ description: "비밀번호 변경 필요" })
	mustChangePassword!: boolean;

	@DateValidation({ nullable: true, description: "비밀번호 변경일" })
	passwordChangedAt!: Date | null;

	@DateValidation({ nullable: true, description: "마지막 로그인 시각" })
	lastLoginAt!: Date | null;

	@StringValidation({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: string | null;

	@BooleanValidation({ description: "활성 상태" })
	isActive!: boolean;

	@BigIntIdValidation({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	currentTenantId!: bigint | null;
}
