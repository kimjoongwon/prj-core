import { BigIntIdFieldOptional } from "@cocrepo/decorator/field";
import { User } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(
	PickType(User, [
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
	] as const),
) {
	@IsOptional()
	@BigIntIdFieldOptional({ description: "소속 공간 ID" })
	spaceId?: bigint;
}
