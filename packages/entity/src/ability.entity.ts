import type {
	Ability as AbilityEntity,
	Prisma,
	Subject,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Action } from "./action.entity";
import type { Role } from "./role.entity";
import type { User } from "./user.entity";

/**
 * Ability 엔티티 (CASL ABAC 기반)
 *
 * Role 또는 User에 부여되는 구체적인 권한을 정의합니다.
 * - roleId만 있으면 Role 기반 기본 권한
 * - userId만 있으면 User 예외 권한
 *
 * DDD 원칙에 따라 Ability는 Role + Subject + Action + fields의 연결만 담당합니다.
 * 마스킹 등의 설정은 Action.config에서 가져옵니다.
 */
export class Ability extends AbstractEntity implements AbilityEntity {
	// CASL 필수 필드
	/** 대상 필드 목록 (빈 배열이면 전체 필드) */
	fields!: string[];
	/** 권한 조건 (JSON 형식) */
	conditions!: Prisma.JsonValue | null;
	/** 거부 권한 여부 (true: cannot, false: can) */
	inverted!: boolean;
	/** 거부 사유 (inverted=true일 때 사용) */
	reason!: string | null;

	// 연결 대상
	/** Subject ID (권한 대상) */
	subjectId!: string;
	/** Action ID (행위 정의) */
	actionId!: string;
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
	subject?: Subject;
	action?: Action;
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

	/**
	 * Action 이름 가져오기
	 * (action 관계가 로드된 경우만 사용 가능)
	 */
	getActionName(): string | null {
		return this.action?.name ?? null;
	}

	/**
	 * 마스킹 Action인지 확인
	 * (action 관계가 로드된 경우만 사용 가능)
	 */
	isMaskingAbility(): boolean {
		return this.action?.isMaskingAction() ?? false;
	}

	/**
	 * 마스킹 프리셋 가져오기
	 * (action 관계가 로드된 경우만 사용 가능)
	 */
	getMaskingPreset(): string | null {
		return this.action?.getMaskingPreset() ?? null;
	}
}
