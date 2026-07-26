import type {
	Ability as AbilityEntity,
	Prisma,
	Subject,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Action } from "./action.entity";
import type { PolicyEntry } from "./policy-entry.entity";

/**
 * Ability 엔티티 (CASL ABAC 기반)
 *
 * 재사용 가능한 권한 정의를 담당합니다.
 * - 권한 정의만 담당, 실제 부여는 Policy/PolicyEntry/RoleAssignment에서 관리
 * - PolicyEntry를 통해 공간별 Policy에 포함됩니다
 *
 * DDD 원칙에 따라 Ability는 Subject + Action + fields + conditions 조합으로 권한을 정의합니다.
 * 마스킹 등의 설정은 Action.config에서 가져옵니다.
 */
export class Ability extends AbstractEntity implements AbilityEntity {
	// 메타데이터
	/** 권한 이름 (재사용 가능한 고유 이름) */
	name!: string;
	/** 권한 설명 */
	description!: string | null;

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

	// RoleAssignment에서 조회할 때 설정되는 필드 (optional)
	/** 우선순위 (Policy assignment priority 값) */
	priority?: number;

	// 관계
	subject?: Subject;
	action?: Action;
	policyEntries?: PolicyEntry[];

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
