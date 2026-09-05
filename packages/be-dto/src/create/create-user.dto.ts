import { BigIntIdField } from "@cocrepo/decorator/field";
import { User } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateUserDto extends PickType(User, [
	"name",
	"email",
	"phone",
	"failedLoginAttempts",
	"lockedUntil",
	"isPermanentlyLocked",
	"mustChangePassword",
	"passwordChangedAt",
	"lastLoginAt",
	"lastLoginIp",
	"isActive",
	"currentTenantId",
] as const) {
	@BigIntIdField({ description: "소속 공간 ID" })
	spaceId!: bigint;
}
