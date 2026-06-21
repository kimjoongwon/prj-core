import {
	adminPlatformAdminAbilitySeedData,
	adminCompanyManagerMenuAccessAbilitySeedData,
} from "./admin-permissions";

/**
 * CASL 기반 ability 기준 데이터입니다.
 *
 * 이 파일은 권한 자체를 "역할 x subject x action" 조합으로 선언하는 곳입니다.
 * action/subject 정의는 다른 파일에 있지만, 최종 정책은 여기서 완성됩니다.
 */

/**
 * CASL Action 타입 (문자열 기반)
 * - create: 생성 권한
 * - read: 조회 권한
 * - update: 수정 권한
 * - delete: 삭제 권한
 * - access: 접근 권한 (메뉴 등)
 * - manage: 모든 권한 (PLATFORM_ADMIN용)
 * - export: 내보내기 권한
 * - import: 가져오기 권한
 * - approve: 승인 권한
 * - reject: 반려 권한
 * - read:full: 전체 조회 권한
 * - read:hidden: 숨김 권한
 * - read:masked:*: 마스킹 조회 권한
 */
export type AbilityAction =
	| "create"
	| "read"
	| "update"
	| "delete"
	| "access"
	| "manage"
	| "export"
	| "import"
	| "approve"
	| "reject"
	| "read:full"
	| "read:hidden"
	| "read:masked:email"
	| "read:masked:phone"
	| "read:masked:name"
	| "read:masked:ssn"
	| "read:masked:card"
	| "read:masked:account";

/**
 * CASL ABAC 기반 Ability 시드 데이터 인터페이스
 *
 * @property roleName - 역할 이름
 * @property subject - Subject 이름 (Prisma 모델명 또는 'menu:xxx', 'feature:xxx', 'ui:xxx' 등)
 * @property actionName - Action 이름 (Action 테이블 참조)
 * @property inverted - true면 cannot (거부), false면 can (허용)
 * @property description - 권한 설명
 * @property name - 권한 이름 (선택)
 * @property reason - 권한 거부 시 표시할 사유 (선택)
 * @property conditions - CASL conditions (예: 자신의 데이터만 접근)
 * @property isActive - 활성 상태
 * @property priority - 우선순위 (높을수록 먼저 적용)
 */
export interface AbilitySeedData {
	roleName: string;
	subject: string; // Prisma 모델명 또는 'all', 'menu:xxx', 'feature:xxx', 'ui:xxx' 등
	actionName: AbilityAction; // Action 테이블의 name 참조
	inverted: boolean; // false = can (허용), true = cannot (거부)
	description: string;
	name?: string; // 권한 이름 (선택)
	reason?: string; // 권한 거부 시 표시할 사유 (선택)
	conditions?: Record<string, unknown>; // CASL conditions (예: 자신의 데이터만 접근)
	isActive?: boolean;
	priority?: number; // 우선순위 (높을수록 먼저 적용)
}

// 배열이 역할별로 나뉘어 있어도 sync 단계에서는 동일한 Ability 테이블에 누적 적용됩니다.
/**
 * PLATFORM_ADMIN 권한 시드 데이터
 * - manage all: 모든 권한
 */
const staticPlatformAdminAbilitySeedData: AbilitySeedData[] = [
	{
		roleName: "PLATFORM_ADMIN",
		subject: "all",
		actionName: "manage",
		inverted: false,
		description: "전체 시스템 관리 권한",
	},
	// ============================================================================
	// 기능 manage
	// ============================================================================
	{
		roleName: "PLATFORM_ADMIN",
		subject: "feature:export",
		actionName: "manage",
		inverted: false,
		description: "내보내기 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "feature:import",
		actionName: "manage",
		inverted: false,
		description: "가져오기 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "feature:bulk-delete",
		actionName: "manage",
		inverted: false,
		description: "일괄 삭제 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "feature:send-notification",
		actionName: "manage",
		inverted: false,
		description: "알림 발송 전체 권한",
	},

	// ============================================================================
	// FAB Quick Actions manage (v7.0)
	// ============================================================================
	{
		roleName: "PLATFORM_ADMIN",
		subject: "quickAction:todayReservation",
		actionName: "manage",
		inverted: false,
		description: "오늘 예약 바로가기 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "quickAction:quickReservation",
		actionName: "manage",
		inverted: false,
		description: "빠른 예약 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "quickAction:userSearch",
		actionName: "manage",
		inverted: false,
		description: "회원 검색 전체 권한",
	},

	// ============================================================================
	// 엔티티 manage
	// ============================================================================
	{
		roleName: "PLATFORM_ADMIN",
		subject: "entity:User",
		actionName: "manage",
		inverted: false,
		description: "사용자 엔티티 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "entity:Ground",
		actionName: "manage",
		inverted: false,
		description: "시설 엔티티 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "entity:Space",
		actionName: "manage",
		inverted: false,
		description: "공간 엔티티 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "entity:Reservation",
		actionName: "manage",
		inverted: false,
		description: "예약 엔티티 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "entity:Content",
		actionName: "manage",
		inverted: false,
		description: "콘텐츠 엔티티 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "entity:Role",
		actionName: "manage",
		inverted: false,
		description: "역할 엔티티 전체 권한",
	},
	{
		roleName: "PLATFORM_ADMIN",
		subject: "entity:Ability",
		actionName: "manage",
		inverted: false,
		description: "권한 엔티티 전체 권한",
	},
];

export const platformAdminAbilitySeedData: AbilitySeedData[] = [
	...staticPlatformAdminAbilitySeedData,
	...adminPlatformAdminAbilitySeedData,
];

/**
 * COMPANY_MANAGER 권한 시드 데이터
 * - 현재 admin catalog 기준 운영 메뉴 access
 * - 엔티티: User, Reservation manage / Ground read, update
 */
export const companyManagerAbilitySeedData: AbilitySeedData[] = [
	...adminCompanyManagerMenuAccessAbilitySeedData,
	// 엔티티 권한
	{
		roleName: "COMPANY_MANAGER",
		subject: "entity:User",
		actionName: "manage",
		inverted: false,
		description: "사용자 엔티티 관리 권한",
	},
	{
		roleName: "COMPANY_MANAGER",
		subject: "entity:Reservation",
		actionName: "manage",
		inverted: false,
		description: "예약 엔티티 관리 권한",
	},
	{
		roleName: "COMPANY_MANAGER",
		subject: "entity:Ground",
		actionName: "read",
		inverted: false,
		description: "시설 조회 권한",
	},
	{
		roleName: "COMPANY_MANAGER",
		subject: "entity:Ground",
		actionName: "update",
		inverted: false,
		description: "시설 수정 권한",
	},
	{
		roleName: "COMPANY_MANAGER",
		subject: "entity:Content",
		actionName: "manage",
		inverted: false,
		description: "콘텐츠 관리 권한",
	},
	// 기능 권한
	{
		roleName: "COMPANY_MANAGER",
		subject: "feature:export",
		actionName: "access",
		inverted: false,
		description: "내보내기 권한",
	},
	{
		roleName: "COMPANY_MANAGER",
		subject: "feature:send-notification",
		actionName: "access",
		inverted: false,
		description: "알림 발송 권한",
	},
	// 일괄 삭제 불가 (inverted=true)
	{
		roleName: "COMPANY_MANAGER",
		subject: "feature:bulk-delete",
		actionName: "access",
		inverted: true,
		description: "일괄 삭제 불가",
	},
];

/**
 * MEMBER 권한 시드 데이터
 * - 자신의 데이터만 read, update 가능 (conditions 사용)
 * - 자신의 예약만 create, read 가능
 */
export const memberAbilitySeedData: AbilitySeedData[] = [
	// 자신의 User 정보만 조회/수정 가능
	{
		roleName: "MEMBER",
		subject: "entity:User",
		actionName: "read",
		inverted: false,
		description: "자신의 사용자 정보 조회 권한",
		conditions: { id: "{{ user.id }}" },
	},
	{
		roleName: "MEMBER",
		subject: "entity:User",
		actionName: "update",
		inverted: false,
		description: "자신의 사용자 정보 수정 권한",
		conditions: { id: "{{ user.id }}" },
	},
	// 자신의 예약만 생성/조회 가능
	{
		roleName: "MEMBER",
		subject: "entity:Reservation",
		actionName: "create",
		inverted: false,
		description: "예약 생성 권한",
	},
	{
		roleName: "MEMBER",
		subject: "entity:Reservation",
		actionName: "read",
		inverted: false,
		description: "자신의 예약 조회 권한",
		conditions: { userId: "{{ user.id }}" },
	},
	{
		roleName: "MEMBER",
		subject: "entity:Reservation",
		actionName: "update",
		inverted: false,
		description: "자신의 예약 수정 권한 (취소 등)",
		conditions: { userId: "{{ user.id }}" },
	},
	// 시설 정보 조회
	{
		roleName: "MEMBER",
		subject: "entity:Ground",
		actionName: "read",
		inverted: false,
		description: "시설 정보 조회 권한",
	},
	// 콘텐츠 조회
	{
		roleName: "MEMBER",
		subject: "entity:Content",
		actionName: "read",
		inverted: false,
		description: "콘텐츠 조회 권한",
	},
];

/**
 * 모든 Ability 시드 데이터를 하나로 합침
 */
export const abilitySeedData: AbilitySeedData[] = [
	...platformAdminAbilitySeedData,
	...companyManagerAbilitySeedData,
	...memberAbilitySeedData,
];

/**
 * 권한 매핑 요약 (문서화용)
 *
 * PLATFORM_ADMIN:
 * - manage all + 현재 admin menu/page catalog의 canonical grant
 * - 제한 없음
 *
 * COMPANY_MANAGER:
 * - 메뉴: 현재 admin catalog 기준 운영 메뉴 access
 * - 템플릿, low-level 권한 카탈로그 메뉴는 기본 제외
 * - 엔티티: User MANAGE, Reservation MANAGE, Ground READ/UPDATE, Content MANAGE
 * - 기능: 내보내기, 알림발송 가능 / 일괄삭제 불가
 *
 * MEMBER:
 * - 엔티티: 자신의 User READ/UPDATE, 자신의 Reservation CREATE/READ/UPDATE
 * - 엔티티: Ground READ, Content READ
 * - 메뉴/기능 접근 없음 (일반 사용자는 Admin 패널 미접근)
 */
export const permissionSummary = {
	PLATFORM_ADMIN: {
		description: "시스템 전체 관리자",
		permissions: "manage all + 현재 admin menu/page catalog의 canonical grant",
	},
	COMPANY_MANAGER: {
		description: "Company 관리자",
		permissions:
			"현재 admin 운영 메뉴 접근, User/Reservation/Content 관리, Ground 조회/수정, 내보내기/알림발송 가능",
	},
	MEMBER: {
		description: "회원",
		permissions: "자신의 정보/예약만 접근, 시설/콘텐츠 조회",
	},
};
