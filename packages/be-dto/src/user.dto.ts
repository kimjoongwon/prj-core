import {
	BigIntIdField,
	BooleanField,
	DateField,
	NumberField,
	StringField,
} from "@cocrepo/decorator/field";
import { User } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { ProfileDto } from "./profile.dto";
import { TenantDto } from "./tenant.dto";
import { UserAssociationDto } from "./user-association.dto";
import { UserClassificationDto } from "./user-classification.dto";

/**
 * 회원 응답 DTO. 인증 상태 필드는 UserStatus 1:1 모델에서 읽은 값을
 * API 형상 유지를 위해 평평하게 노출합니다.
 */
export class UserDto extends EntityResponseType(User, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"email",
		"name",
		"phone",
		"passwordChangedAt",
		"profiles",
		"tenants",
		"associations",
		"classification",
	] as const,
	relations: {
		profiles: () => ProfileDto,
		tenants: () => TenantDto,
		associations: () => UserAssociationDto,
		classification: () => UserClassificationDto,
	},
	extraFields: [
		"spaceId",
		"failedLoginAttempts",
		"lockedUntil",
		"isPermanentlyLocked",
		"lastLoginAt",
		"lastLoginIp",
		"isActive",
		"currentTenantId",
	],
}) {
	@BigIntIdField({ description: "소속 공간 ID" })
	spaceId: bigint;

	@NumberField({ description: "로그인 실패 횟수" })
	failedLoginAttempts: number;

	@DateField({ nullable: true, description: "잠금 해제 시각" })
	lockedUntil: Date | null;

	@BooleanField({ description: "영구 잠금 여부" })
	isPermanentlyLocked: boolean;

	@DateField({ nullable: true, description: "마지막 로그인 시각" })
	lastLoginAt: Date | null;

	@StringField({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp: string | null;

	@BooleanField({ description: "활성 상태" })
	isActive: boolean;

	@BigIntIdField({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	currentTenantId: bigint | null;

	declare profiles?: ProfileDto[];
	declare tenants?: TenantDto[];
	declare associations?: UserAssociationDto[];
	declare classification?: UserClassificationDto;
}
