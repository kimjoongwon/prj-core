import type {
	Profile,
	UserAssociation,
	User as UserEntityType,
} from "@cocrepo/prisma";
import type { TenantDto } from "@cocrepo/dto";
import { SpaceCategoryName } from "@cocrepo/enum";
import type { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";
import type { AuthAuditLog } from "./auth-audit-log.entity";
import type { PasswordHistory } from "./password-history.entity";

export class User extends AbstractEntity implements UserEntityType {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	name!: string;
	email!: string;
	phone!: string;
	password!: string;
	failedLoginAttempts!: number;
	isPermanentlyLocked!: boolean;
	mustChangePassword!: boolean;
	isActive!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	lockedUntil!: Date | null;
	passwordChangedAt!: Date | null;
	lastLoginAt!: Date | null;
	lastLoginIp!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	profiles?: Profile[];
	tenants?: TenantDto[]; // Prisma Tenant 대신 TenantDto 사용
	associations?: UserAssociation[];
	passwordHistory?: PasswordHistory[];
	authAuditLogs?: AuthAuditLog[];

	/**
	 * 사용자별 예외 권한 (CASL)
	 */
	abilities?: Ability[];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 사용자가 특정 테넌트에 속해 있는지 확인합니다
	 */
	hasTenantAccess(tenantId: string): boolean {
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
	static fromDto<T extends { id: string; tenants?: TenantDto[] }>(
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
		return this.tenants?.some((tenant) => {
			const categoryName =
				tenant.space?.spaceClassification?.category?.name;
			return categoryName === SpaceCategoryName.ROOT.name;
		}) ?? false;
	}

	/**
	 * 접근 가능한 Space IDs
	 * - 슈퍼매니저: undefined (전체 조회)
	 * - 일반: tenants의 spaceIds
	 */
	get accessibleSpaceIds(): string[] | undefined {
		if (this.isSuperManager()) return undefined;
		return this.tenants?.map((t) => t.spaceId).filter(Boolean) ?? [];
	}

	/**
	 * 특정 Space에 접근 권한이 있는지 확인
	 */
	canAccessSpace(spaceId: string): boolean {
		if (this.isSuperManager()) return true;
		return this.tenants?.some((t) => t.spaceId === spaceId) ?? false;
	}
}
