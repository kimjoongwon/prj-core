import {
	ClassField,
	DateFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { User } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";
import { IdpAccountAccessGrantDto } from "./idp-account-access-grant.dto";

export class IdpAccountDetailDto extends EntityResponseType(User, {
	pick: [
		"id",
		"name",
		"isActive",
		"failedLoginAttempts",
		"isPermanentlyLocked",
		"mustChangePassword",
		"createdAt",
	] as const,

	extraFields: [
		"email",
		"lockedUntil",
		"lastLoginAt",
		"lastLoginIp",
		"accessGrants",
	],
}) {
	@StringField({ description: "이메일" })
	email!: string;

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
