import {
	BigIntIdFieldMetadata,
	BooleanFieldMetadata,
	ClassField,
	DateFieldMetadata,
	EmailFieldMetadata,
	NumberFieldMetadata,
	StringFieldMetadata,
	ULIDFieldMetadata,
} from "@cocrepo/decorator/field";
import { SpaceCategoryName } from "@cocrepo/enum";
import { UserSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { AuthAuditLog } from "./auth-audit-log.entity";
import { PasswordHistory } from "./password-history.entity";
import { Profile } from "./profile.entity";
import { Tenant } from "./tenant.entity";
import { UserAssociation } from "./user-association.entity";
import { UserClassification } from "./user-classification.entity";

/**
 * Tenant with Space relations for User entity
 * Prisma include로 가져온 관계 데이터를 위한 확장 타입
 */
type TenantWithSpace = {
	id: bigint;
	spaceId?: bigint | null;
	space?: {
		spaceClassification?: {
			category?: {
				name: string;
			} | null;
		} | null;
	} | null;
};

type UserTenantSnapshotLike = {
	id: bigint;
	spaceId?: bigint | null;
	space?: {
		spaceClassification?: {
			category?: {
				name?: string | null;
			} | null;
		} | null;
	} | null;
};

@AbstractEntityFields()
export class User extends UserSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	@ULIDFieldMetadata()
	declare userId: UserSchema["userId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@StringFieldMetadata({ description: "사용자 이름" })
	declare name: UserSchema["name"];
	@EmailFieldMetadata({ description: "이메일 주소" })
	declare email: UserSchema["email"];
	@StringFieldMetadata({ description: "연락처" })
	declare phone: UserSchema["phone"];
	@Exclude({ toPlainOnly: true })
	declare password: UserSchema["password"];
	@NumberFieldMetadata({ description: "로그인 실패 횟수" })
	declare failedLoginAttempts: UserSchema["failedLoginAttempts"];
	@BooleanFieldMetadata({ description: "영구 잠금 여부" })
	declare isPermanentlyLocked: UserSchema["isPermanentlyLocked"];
	@BooleanFieldMetadata({ description: "비밀번호 변경 필요" })
	declare mustChangePassword: UserSchema["mustChangePassword"];
	@BooleanFieldMetadata({ description: "활성 상태" })
	declare isActive: UserSchema["isActive"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@DateFieldMetadata({ nullable: true, description: "잠금 해제 시각" })
	declare lockedUntil: UserSchema["lockedUntil"];
	@DateFieldMetadata({ nullable: true, description: "비밀번호 변경일" })
	declare passwordChangedAt: UserSchema["passwordChangedAt"];
	@DateFieldMetadata({ nullable: true, description: "마지막 로그인 시각" })
	declare lastLoginAt: UserSchema["lastLoginAt"];
	@StringFieldMetadata({ nullable: true, description: "마지막 로그인 IP" })
	declare lastLoginIp: UserSchema["lastLoginIp"];
	@BigIntIdFieldMetadata({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	declare currentTenantId: UserSchema["currentTenantId"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	@ClassField(() => Profile, {
		isArray: true,
		required: false,
		description: "프로필 목록",
	})
	profiles?: Profile[];
	@ClassField(() => Tenant, {
		isArray: true,
		required: false,
		description: "테넌트 목록",
	})
	tenants?: TenantWithSpace[]; // Prisma include로 가져온 확장 타입
	@ClassField(() => UserAssociation, {
		required: false,
		isArray: true,
		description: "사용자 연결 정보",
	})
	associations?: UserAssociation[];
	@ClassField(() => UserClassification, {
		required: false,
		description: "사용자 분류 정보",
	})
	classification?: UserClassification;
	@ClassField(() => PasswordHistory, {
		required: false,
		each: true,
		isArray: true,
	})
	passwordHistory?: PasswordHistory[];
	@ClassField(() => AuthAuditLog, {
		required: false,
		each: true,
		isArray: true,
	})
	authAuditLogs?: AuthAuditLog[];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 사용자가 특정 테넌트에 속해 있는지 확인합니다
	 */
	hasTenantAccess(tenantId: bigint): boolean {
		if (!this.tenants) return false;
		return this.tenants.some((tenant) => tenant.id === tenantId);
	}

	/**
	 * 사용자가 삭제되지 않은 상태인지 확인
	 */
	isNotRemoved(): boolean {
		return this.removedAt === null;
	}

	/**
	 * 사용자 계정이 현재 잠금 상태인지 확인
	 */
	isLocked(): boolean {
		if (this.isPermanentlyLocked) return true;
		if (this.lockedUntil && this.lockedUntil > new Date()) return true;
		return false;
	}

	/**
	 * 비밀번호 변경이 필요한지 확인
	 */
	needsPasswordChange(): boolean {
		return this.mustChangePassword;
	}

	/**
	 * DTO로부터 Entity 생성 (팩토리)
	 */
	static fromDto<T extends { id: bigint; tenants?: UserTenantSnapshotLike[] }>(
		dto: T,
	): User {
		const user = new User();
		Object.assign(user, dto);
		return user;
	}

	/**
	 * 슈퍼매니저(ROOT Space 소속) 여부
	 */
	isSuperManager(): boolean {
		return (
			this.tenants?.some((tenant) => {
				const categoryName = tenant.space?.spaceClassification?.category?.name;
				return categoryName === SpaceCategoryName.ROOT.name;
			}) ?? false
		);
	}

	/**
	 * 접근 가능한 Space IDs
	 * - 슈퍼매니저: undefined (전체 조회)
	 * - 일반: tenants의 spaceIds
	 */
	get accessibleSpaceIds(): bigint[] | undefined {
		if (this.isSuperManager()) return undefined;
		return (
			this.tenants
				?.map((t) => t.spaceId)
				.filter((spaceId): spaceId is bigint => spaceId != null) ?? []
		);
	}

	/**
	 * 특정 Space에 접근 권한이 있는지 확인
	 */
	canAccessSpace(spaceId: bigint): boolean {
		if (this.isSuperManager()) return true;
		return this.tenants?.some((t) => t.spaceId === spaceId) ?? false;
	}
}
