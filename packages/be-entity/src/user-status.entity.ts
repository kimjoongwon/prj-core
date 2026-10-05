import {
	BigIntIdFieldMetadata,
	BooleanFieldMetadata,
	ClassField,
	DateFieldMetadata,
	NumberFieldMetadata,
	StringFieldMetadata,
	ULIDFieldMetadata,
} from "@cocrepo/decorator/field";
import { UserStatusSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Tenant } from "./tenant.entity";
import { User } from "./user.entity";

/** User에 종속되는 인증 상태 1:1 상세 엔티티입니다. */
@AbstractEntityFields()
export class UserStatus extends UserStatusSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	@ULIDFieldMetadata()
	declare userStatusId: UserStatusSchema["userStatusId"];

	@BigIntIdFieldMetadata({ description: "소속 사용자 내부 순번" })
	declare userId: UserStatusSchema["userId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BooleanFieldMetadata({ description: "활성 상태" })
	declare isActive: UserStatusSchema["isActive"];
	@NumberFieldMetadata({ description: "로그인 실패 횟수" })
	declare failedLoginAttempts: UserStatusSchema["failedLoginAttempts"];
	@BooleanFieldMetadata({ description: "영구 잠금 여부" })
	declare isPermanentlyLocked: UserStatusSchema["isPermanentlyLocked"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@DateFieldMetadata({ nullable: true, description: "잠금 해제 시각" })
	declare lockedUntil: UserStatusSchema["lockedUntil"];
	@DateFieldMetadata({ nullable: true, description: "마지막 로그인 시각" })
	declare lastLoginAt: UserStatusSchema["lastLoginAt"];
	@StringFieldMetadata({ nullable: true, description: "마지막 로그인 IP" })
	declare lastLoginIp: UserStatusSchema["lastLoginIp"];
	@BigIntIdFieldMetadata({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	declare currentTenantId: UserStatusSchema["currentTenantId"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	@ClassField(() => User, { required: false })
	user?: User;
	@ClassField(() => Tenant, { required: false })
	currentTenant?: Tenant;
}
