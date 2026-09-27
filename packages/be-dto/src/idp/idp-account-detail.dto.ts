import {
	BooleanField,
	ClassField,
	DateFieldOptional,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { User } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";
import { IdpAccountAccessGrantDto } from "./idp-account-access-grant.dto";

/**
 * IDP 계정 상세 응답 DTO. 활성/잠금 상태는 UserStatus에서 읽은 값을 평평하게 노출합니다.
 */
export class IdpAccountDetailDto extends EntityResponseType(User, {
	pick: ["id", "name", "createdAt"] as const,

	extraFields: [
		"email",
		"isActive",
		"failedLoginAttempts",
		"isPermanentlyLocked",
		"lockedUntil",
		"lastLoginAt",
		"lastLoginIp",
		"accessGrants",
	],
}) {
	@StringField({ description: "이메일" })
	email!: string;

	@BooleanField({ description: "활성 상태" })
	isActive: boolean;

	@NumberField({ description: "로그인 실패 횟수" })
	failedLoginAttempts: number;

	@BooleanField({ description: "영구 잠금 여부" })
	isPermanentlyLocked: boolean;

	@DateFieldOptional({ nullable: true, description: "일시 잠금 해제 시간" })
	lockedUntil!: Date | null;

	@DateFieldOptional({ nullable: true, description: "마지막 로그인 시간" })
	lastLoginAt!: Date | null;

	@StringFieldOptional({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: string | null;

	@ClassField(() => IdpAccountAccessGrantDto, {
		each: true,
		isArray: true,
		description: "계정에 부여된 Space/Role 접근 권한 목록",
	})
	accessGrants!: IdpAccountAccessGrantDto[];
}
