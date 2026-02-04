import type { Grant as GrantEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Ability } from "./ability.entity";

/**
 * Grant 엔티티 (권한 부여)
 *
 * Role 또는 User에 Ability를 부여하는 다형성 BRIDGE 테이블입니다.
 * - granteeType이 "Role"이면 역할 기반 권한
 * - granteeType이 "User"이면 사용자별 예외 권한
 *
 * 우선순위:
 * - User 권한: 10+ (더 높은 우선순위)
 * - Role 권한: 0-9 (기본 우선순위)
 */
export class Grant extends AbstractEntity implements GrantEntity {
	// ============================================================================
	// 다형성 FK (Polymorphic Association)
	// ============================================================================

	/** 권한 대상 유형 ("Role" | "User") */
	granteeType!: string;
	/** 권한 대상 ID (roleId 또는 userId) */
	granteeId!: string;
	/** 권한 ID */
	abilityId!: string;

	// ============================================================================
	// 메타데이터
	// ============================================================================

	/** 활성화 여부 */
	isActive!: boolean;
	/** 우선순위 (User: 10+, Role: 0-9) */
	priority!: number;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================

	@Type(() => Ability)
	ability?: Ability;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 역할 기반 권한 부여인지 확인합니다
	 */
	isRoleGrant(): boolean {
		return this.granteeType === "Role";
	}

	/**
	 * 사용자별 예외 권한 부여인지 확인합니다
	 */
	isUserGrant(): boolean {
		return this.granteeType === "User";
	}

	/**
	 * 권한이 활성화되어 있는지 확인합니다
	 */
	isEnabled(): boolean {
		return this.isActive && this.removedAt === null;
	}

	/**
	 * 우선순위가 사용자 권한 수준인지 확인합니다
	 * (일반적으로 User 권한은 10 이상)
	 */
	isHighPriority(): boolean {
		return this.priority >= 10;
	}

	/**
	 * 우선순위가 역할 권한 수준인지 확인합니다
	 * (일반적으로 Role 권한은 0-9)
	 */
	isRolePriority(): boolean {
		return this.priority >= 0 && this.priority < 10;
	}
}
