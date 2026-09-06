import {
	BigIntIdField,
	BooleanField,
	ClassField,
	DateField,
	EmailField,
	NumberField,
	StringField,
	ULIDField,
} from "@cocrepo/decorator/field";
import { SpaceCategoryName } from "@cocrepo/enum";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
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

export class User extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	@ULIDField()
	userId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@StringField({ description: "사용자 이름" })
	name!: string;
	@EmailField({ description: "이메일 주소" })
	email!: string;
	@StringField({ description: "연락처" })
	phone!: string;
	@Exclude({ toPlainOnly: true })
	password!: string;
	@NumberField({ description: "로그인 실패 횟수" })
	failedLoginAttempts!: number;
	@BooleanField({ description: "영구 잠금 여부" })
	isPermanentlyLocked!: boolean;
	@BooleanField({ description: "비밀번호 변경 필요" })
	mustChangePassword!: boolean;
	@BooleanField({ description: "활성 상태" })
	isActive!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@DateField({ nullable: true, description: "잠금 해제 시각" })
	lockedUntil!: Date | null;
	@DateField({ nullable: true, description: "비밀번호 변경일" })
	passwordChangedAt!: Date | null;
	@DateField({ nullable: true, description: "마지막 로그인 시각" })
	lastLoginAt!: Date | null;
	@StringField({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: string | null;
	@BigIntIdField({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	currentTenantId!: bigint | null;

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
	@ClassField(() => PasswordHistory, { required: false, each: true, isArray: true })
	passwordHistory?: PasswordHistory[];
	@ClassField(() => AuthAuditLog, { required: false, each: true, isArray: true })
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
