import type { Ability as AbilityEntity, Prisma } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Role } from "./role.entity";
import type { User } from "./user.entity";

/**
 * Ability 엔티티 (CASL ABAC 기반)
 *
 * Role 또는 User에 부여되는 구체적인 권한을 정의합니다.
 * - roleId만 있으면 Role 기반 기본 권한
 * - userId만 있으면 User 예외 권한
 */
export class Ability extends AbstractEntity implements AbilityEntity {
	// CASL 필수 필드
	/** 액션 (create, read, update, delete, manage) */
	action!: string;
	/** 대상 Subject (Prisma 모델명 또는 'all') */
	subject!: string;
	/** 대상 필드 목록 (빈 배열이면 전체 필드) */
	fields!: string[];
	/** 권한 조건 (JSON 형식) */
	conditions!: Prisma.JsonValue | null;
	/** 거부 권한 여부 (true: cannot, false: can) */
	inverted!: boolean;
	/** 거부 사유 (inverted=true일 때 사용) */
	reason!: string | null;

	// 연결 대상 (Role 기반 또는 User 기반)
	/** Role ID (Role 기반 권한일 때) */
	roleId!: string | null;
	/** User ID (User 예외 권한일 때) */
	userId!: string | null;

	// 메타데이터
	/** 권한 이름 */
	name!: string | null;
	/** 권한 설명 */
	description!: string | null;
	/** 활성화 여부 */
	isActive!: boolean;
	/** 우선순위 (높을수록 우선) */
	priority!: number;

	// 관계
	role?: Role;
	user?: User;

	/**
	 * 역할 기반 권한인지 확인
	 */
	isRoleBased(): boolean {
		return this.roleId !== null && this.userId === null;
	}

	/**
	 * 사용자 기반 예외 권한인지 확인
	 */
	isUserException(): boolean {
		return this.userId !== null;
	}

	/**
	 * 허용 권한인지 확인
	 */
	isAllowed(): boolean {
		return !this.inverted;
	}

	/**
	 * 거부 권한인지 확인
	 */
	isDenied(): boolean {
		return this.inverted;
	}
}
