import {
	BooleanField,
	DateField,
	DateFieldOptional,
	NumberField,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";

/**
 * IDP 계정 정보 DTO (보안 필드 포함)
 */
export class IdpAccountDto {
	@ULIDField({ description: "사용자 ID" })
	id!: string;

	@StringField({ description: "이름" })
	name!: string;

	@StringField({ description: "이메일" })
	email!: string;

	@BooleanField({ description: "활성 상태" })
	isActive!: boolean;

	@NumberField({ description: "로그인 실패 횟수" })
	failedLoginAttempts!: number;

	@BooleanField({ description: "영구 잠금 여부" })
	isPermanentlyLocked!: boolean;

	@DateFieldOptional({ nullable: true, description: "일시 잠금 해제 시간" })
	lockedUntil!: Date | null;

	@BooleanField({ description: "비밀번호 변경 필요 여부" })
	mustChangePassword!: boolean;

	@DateFieldOptional({ nullable: true, description: "마지막 로그인 시간" })
	lastLoginAt!: Date | null;

	@StringFieldOptional({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: string | null;

	@DateField({ description: "가입일" })
	createdAt!: Date;
}
