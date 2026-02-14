import type {
	Profile,
	Tenant,
	UserAssociation,
	User as UserEntity,
} from "@cocrepo/prisma";
import type { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";
import type { AuthAuditLog } from "./auth-audit-log.entity";
import type { PasswordHistory } from "./password-history.entity";

export class User extends AbstractEntity implements UserEntity {
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
	tenants?: Tenant[];
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
	 * 사용자가 삭제되지 않은 상태인지 확인합니다
	 */
	isNotRemoved(): boolean {
		return this.removedAt === null;
	}

	/**
	 * 사용자 계정이 현재 잠금 상태인지 확인합니다
	 */
	isLocked(): boolean {
		if (this.isPermanentlyLocked) return true;
		if (this.lockedUntil && this.lockedUntil > new Date()) return true;
		return false;
	}

	/**
	 * 비밀번호 변경이 필요한지 확인합니다
	 */
	needsPasswordChange(): boolean {
		return this.mustChangePassword;
	}
}
