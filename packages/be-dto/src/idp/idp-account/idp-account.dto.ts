import {
	DateFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { User } from "@cocrepo/entity";
import { EntityResponseType } from "../../mapped-types";

export class IdpAccountDto extends EntityResponseType(User, {
	pick: [
		"id",
		"name",
		"isActive",
		"failedLoginAttempts",
		"isPermanentlyLocked",
		"mustChangePassword",
		"createdAt",
	] as const,

	extraFields: ["email", "lockedUntil", "lastLoginAt", "lastLoginIp"],
}) {
	@StringField({ description: "이메일" })
	email!: string;

	@DateFieldOptional({ nullable: true, description: "일시 잠금 해제 시간" })
	lockedUntil!: Date | null;

	@DateFieldOptional({ nullable: true, description: "마지막 로그인 시간" })
	lastLoginAt!: Date | null;

	@StringFieldOptional({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: string | null;
}
