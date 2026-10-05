/**
 * CASL 권한 시스템 타입 정의
 *
 * @description
 * CASL 기반 접근 제어 시스템에서 사용되는 타입들을 정의합니다.
 * Actions: 수행할 수 있는 행위 (CREATE, READ, UPDATE, DELETE 등)
 * Subjects: 권한의 대상 (menu:members, entity:User 등)
 */
import type { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";

// Action Config 타입들은 @cocrepo/type에서 re-export
export type {
	ActionConfig,
	ActionFormatConfig,
	ActionMaskingConfig,
	ActionTransformConfig,
} from "@cocrepo/type";

/**
 * 권한 행위 타입
 *
 * @description
 * - CREATE: 생성 권한
 * - READ: 조회 권한
 * - UPDATE: 수정 권한
 * - DELETE: 삭제 권한
 * - ACCESS: 접근 권한 (메뉴, 페이지)
 * - MANAGE: 전체 관리 권한 (모든 CRUD 포함)
 * - EXPORT: 내보내기 권한
 * - IMPORT: 가져오기 권한
 * - APPROVE: 승인 권한
 * - REJECT: 거절 권한
 * - READ:FULL: 전체 조회 권한 (마스킹 없음)
 * - READ:HIDDEN: 숨김 권한
 * - READ:MASKED:*: 마스킹 조회 권한 (이메일, 전화번호 등)
 */
export type Actions =
	| "CREATE"
	| "READ"
	| "UPDATE"
	| "DELETE"
	| "ACCESS"
	| "MANAGE"
	| "EXPORT"
	| "IMPORT"
	| "APPROVE"
	| "REJECT"
	// Visibility Actions
	| "READ:FULL"
	| "READ:HIDDEN"
	| "READ:MASKED:EMAIL"
	| "READ:MASKED:PHONE"
	| "READ:MASKED:NAME"
	| "READ:MASKED:SSN"
	| "READ:MASKED:CARD"
	| "READ:MASKED:ACCOUNT";

/**
 * 권한 대상 타입
 *
 * @description
 * Subject는 문자열로 정의되며 다음과 같은 형태를 가집니다:
 * - menu:members - 메뉴 접근 권한
 * - feature:export - 기능 접근 권한
 * - entity:User, entity:FitnessCenter - 엔티티 CRUD 권한
 * - api:users - API 엔드포인트 권한
 * - column:user:email - 테이블 컬럼 가시성
 * - all - 모든 권한 (PLATFORM_ADMIN용)
 */
export type Subjects = string;

/**
 * 애플리케이션 Ability 타입
 *
 * @description
 * CASL의 Ability 클래스를 기반으로 Actions와 Subjects를 조합한 타입입니다.
 */
export type AppAbility = Ability<[Actions, Subjects]>;

/**
 * 애플리케이션 AbilityBuilder 타입
 *
 * @description
 * CASL의 AbilityBuilder를 기반으로 AppAbility를 생성하기 위한 빌더 타입입니다.
 */
export type AppAbilityBuilder = AbilityBuilder<AppAbility>;

/**
 * AppAbility 클래스 타입
 *
 * @description
 * Ability 클래스를 AppAbility 타입으로 캐스팅하기 위한 타입입니다.
 */
export type AppAbilityClass = AbilityClass<AppAbility>;

/**
 * 조건 표현식 인터페이스
 *
 * @description
 * CASL conditions에서 사용되는 조건 연산자를 정의합니다.
 */
export interface ConditionExpression {
	/** 같음 */
	$eq?: unknown;
	/** 같지 않음 */
	$ne?: unknown;
	/** 포함 */
	$in?: unknown[];
	/** 미포함 */
	$nin?: unknown[];
	/** 초과 */
	$gt?: number;
	/** 이상 */
	$gte?: number;
	/** 미만 */
	$lt?: number;
	/** 이하 */
	$lte?: number;
}

/**
 * Ability 조건 인터페이스
 *
 * @description
 * 권한에 적용되는 조건을 정의합니다.
 * 필드명을 키로, 조건 값 또는 조건 표현식을 값으로 가집니다.
 */
export interface AbilityCondition {
	[field: string]:
		| string
		| number
		| boolean
		| null
		| undefined
		| ConditionExpression;
}
