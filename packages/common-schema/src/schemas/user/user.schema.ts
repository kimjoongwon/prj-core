import type { User as PrismaUser } from "@cocrepo/prisma";
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
export class UserSchema extends AbstractSchema implements PrismaUser {
	@ULIDValidation()
	userId!: PrismaUser["userId"];

	@StringValidation({ description: "연락처" })
	phone!: PrismaUser["phone"];

	@StringValidation({ description: "사용자 이름" })
	name!: PrismaUser["name"];

	@EmailValidation({ description: "이메일 주소" })
	email!: PrismaUser["email"];

	@StoredStringValidation()
	password!: PrismaUser["password"];

	@NumberValidation({ description: "로그인 실패 횟수" })
	failedLoginAttempts!: PrismaUser["failedLoginAttempts"];

	@DateValidation({ nullable: true, description: "잠금 해제 시각" })
	lockedUntil!: PrismaUser["lockedUntil"];

	@BooleanValidation({ description: "영구 잠금 여부" })
	isPermanentlyLocked!: PrismaUser["isPermanentlyLocked"];

	@BooleanValidation({ description: "비밀번호 변경 필요" })
	mustChangePassword!: PrismaUser["mustChangePassword"];

	@DateValidation({ nullable: true, description: "비밀번호 변경일" })
	passwordChangedAt!: PrismaUser["passwordChangedAt"];

	@DateValidation({ nullable: true, description: "마지막 로그인 시각" })
	lastLoginAt!: PrismaUser["lastLoginAt"];

	@StringValidation({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: PrismaUser["lastLoginIp"];

	@BooleanValidation({ description: "활성 상태" })
	isActive!: PrismaUser["isActive"];

	@BigIntIdValidation({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	currentTenantId!: PrismaUser["currentTenantId"];
}
