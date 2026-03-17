// ============================================================================
// Ability (CASL ABAC 권한 정의) 시드 데이터
// ============================================================================

/**
 * CASL Action 타입 (문자열 기반)
 * - create: 생성 권한
 * - read: 조회 권한
 * - update: 수정 권한
 * - delete: 삭제 권한
 * - access: 접근 권한 (메뉴 등)
 * - manage: 모든 권한 (FULL_ACCESS용)
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

/**
 * FULL_ACCESS 권한 시드 데이터 (v7.0)
 * - manage all: 모든 권한
 */
export const fullAccessAbilitySeedData: AbilitySeedData[] = [
	// ============================================================================
	// v7.0 메뉴 manage (1depth)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:dashboard",
		actionName: "manage",
		inverted: false,
		description: "대시보드 전체 관리 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:users",
		actionName: "manage",
		inverted: false,
		description: "회원 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:reservations",
		actionName: "manage",
		inverted: false,
		description: "예약 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:notifications",
		actionName: "manage",
		inverted: false,
		description: "알림 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:inquiries",
		actionName: "manage",
		inverted: false,
		description: "문의 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:contents",
		actionName: "manage",
		inverted: false,
		description: "콘텐츠 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:templates",
		actionName: "manage",
		inverted: false,
		description: "템플릿 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:sessions",
		actionName: "manage",
		inverted: false,
		description: "세션 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:spaces",
		actionName: "manage",
		inverted: false,
		description: "시설 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:admins",
		actionName: "manage",
		inverted: false,
		description: "관리자 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:roles",
		actionName: "manage",
		inverted: false,
		description: "역할/권한 관리 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 회원)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:users:list",
		actionName: "manage",
		inverted: false,
		description: "회원 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:users:grades",
		actionName: "manage",
		inverted: false,
		description: "등급 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:users:withdrawn",
		actionName: "manage",
		inverted: false,
		description: "탈퇴 회원 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 예약)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:reservations:today",
		actionName: "manage",
		inverted: false,
		description: "오늘 예약 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:reservations:list",
		actionName: "manage",
		inverted: false,
		description: "예약 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:reservations:calendar",
		actionName: "manage",
		inverted: false,
		description: "캘린더 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:reservations:stats",
		actionName: "manage",
		inverted: false,
		description: "통계 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 알림)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:notifications:send",
		actionName: "manage",
		inverted: false,
		description: "알림 발송 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:notifications:history",
		actionName: "manage",
		inverted: false,
		description: "발송 내역 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:notifications:templates",
		actionName: "manage",
		inverted: false,
		description: "알림 템플릿 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:notifications:settings",
		actionName: "manage",
		inverted: false,
		description: "알림 설정 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 문의)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:inquiries:list",
		actionName: "manage",
		inverted: false,
		description: "문의 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:inquiries:direct",
		actionName: "manage",
		inverted: false,
		description: "1:1 문의 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:inquiries:answered",
		actionName: "manage",
		inverted: false,
		description: "답변 완료 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:inquiries:faq",
		actionName: "manage",
		inverted: false,
		description: "FAQ 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 콘텐츠)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:contents:notices",
		actionName: "manage",
		inverted: false,
		description: "공지사항 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:contents:banners",
		actionName: "manage",
		inverted: false,
		description: "배너 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:contents:events",
		actionName: "manage",
		inverted: false,
		description: "이벤트 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:contents:terms",
		actionName: "manage",
		inverted: false,
		description: "이용약관 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 템플릿)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:templates:sms",
		actionName: "manage",
		inverted: false,
		description: "SMS 템플릿 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:templates:email",
		actionName: "manage",
		inverted: false,
		description: "이메일 템플릿 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:templates:push",
		actionName: "manage",
		inverted: false,
		description: "푸시 템플릿 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:templates:html",
		actionName: "manage",
		inverted: false,
		description: "HTML 템플릿 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 세션)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:sessions:timelines",
		actionName: "manage",
		inverted: false,
		description: "타임라인 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:sessions:list",
		actionName: "manage",
		inverted: false,
		description: "세션 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:sessions:programs",
		actionName: "manage",
		inverted: false,
		description: "프로그램 배정 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:sessions:routines",
		actionName: "manage",
		inverted: false,
		description: "루틴 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 시설)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:spaces:info",
		actionName: "manage",
		inverted: false,
		description: "시설 정보 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:spaces:programs",
		actionName: "manage",
		inverted: false,
		description: "프로그램 정의 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:spaces:equipment",
		actionName: "manage",
		inverted: false,
		description: "장비/시설물 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 관리자)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:admins:list",
		actionName: "manage",
		inverted: false,
		description: "관리자 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:admins:invitations",
		actionName: "manage",
		inverted: false,
		description: "초대 관리 전체 권한",
	},

	// ============================================================================
	// v7.0 메뉴 manage (2depth - 역할/권한)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:roles:list",
		actionName: "manage",
		inverted: false,
		description: "역할 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:roles:abilities",
		actionName: "manage",
		inverted: false,
		description: "권한 설정 전체 권한",
	},

	// ============================================================================
	// v7.1 신규 메뉴 manage (1depth - 일정/운동/루틴)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:timelines",
		actionName: "manage",
		inverted: false,
		description: "일정 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:tasks",
		actionName: "manage",
		inverted: false,
		description: "운동 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:routines",
		actionName: "manage",
		inverted: false,
		description: "루틴 전체 권한",
	},
	// ============================================================================
	// v7.1 신규 메뉴 manage (2depth - 시설 목록)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:spaces:list",
		actionName: "manage",
		inverted: false,
		description: "시설 목록 전체 권한",
	},

	// ============================================================================
	// v7.1 신규 메뉴 manage (2depth - 일정/운동/루틴)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:timelines:list",
		actionName: "manage",
		inverted: false,
		description: "타임라인 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:tasks:list",
		actionName: "manage",
		inverted: false,
		description: "운동 종목 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:routines:list",
		actionName: "manage",
		inverted: false,
		description: "루틴 목록 전체 권한",
	},

	// ============================================================================
	// v7.1 신규 메뉴 manage (2depth - 템플릿 목록)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:templates:list",
		actionName: "manage",
		inverted: false,
		description: "템플릿 목록 전체 권한",
	},

	// ============================================================================
	// v7.1 신규 메뉴 manage (2depth - 역할/권한 세부)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:role-groups",
		actionName: "manage",
		inverted: false,
		description: "역할 그룹 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:role-groups:list",
		actionName: "manage",
		inverted: false,
		description: "역할 그룹 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:role-categories",
		actionName: "manage",
		inverted: false,
		description: "역할 카테고리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:role-categories:list",
		actionName: "manage",
		inverted: false,
		description: "역할 카테고리 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:abilities",
		actionName: "manage",
		inverted: false,
		description: "권한 정의 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:abilities:list",
		actionName: "manage",
		inverted: false,
		description: "권한 정의 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:actions",
		actionName: "manage",
		inverted: false,
		description: "액션 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:actions:list",
		actionName: "manage",
		inverted: false,
		description: "액션 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:subjects",
		actionName: "manage",
		inverted: false,
		description: "대상 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:subjects:list",
		actionName: "manage",
		inverted: false,
		description: "대상 목록 전체 권한",
	},

	// ============================================================================
	// 레거시 메뉴 manage (하위 호환성)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:schedules",
		actionName: "manage",
		inverted: false,
		description: "일정 관리 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:files",
		actionName: "manage",
		inverted: false,
		description: "파일 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:wallets",
		actionName: "manage",
		inverted: false,
		description: "지갑 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:settings",
		actionName: "manage",
		inverted: false,
		description: "설정 관리 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:users:profiles",
		actionName: "manage",
		inverted: false,
		description: "프로필 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:users:categories",
		actionName: "manage",
		inverted: false,
		description: "사용자 분류 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:users:groups",
		actionName: "manage",
		inverted: false,
		description: "그룹 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:schedules:timelines",
		actionName: "manage",
		inverted: false,
		description: "타임라인 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:schedules:sessions",
		actionName: "manage",
		inverted: false,
		description: "세션 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:schedules:programs",
		actionName: "manage",
		inverted: false,
		description: "프로그램 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:schedules:routines",
		actionName: "manage",
		inverted: false,
		description: "루틴 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:files:list",
		actionName: "manage",
		inverted: false,
		description: "파일 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:files:categories",
		actionName: "manage",
		inverted: false,
		description: "파일 분류 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:contents:posts",
		actionName: "manage",
		inverted: false,
		description: "게시물 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:contents:list",
		actionName: "manage",
		inverted: false,
		description: "콘텐츠 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:wallets:list",
		actionName: "manage",
		inverted: false,
		description: "지갑 목록 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:wallets:transactions",
		actionName: "manage",
		inverted: false,
		description: "트랜잭션 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:settings:spaces",
		actionName: "manage",
		inverted: false,
		description: "시설 정보 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:settings:admins",
		actionName: "manage",
		inverted: false,
		description: "관리자 관리 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:settings:abilities",
		actionName: "manage",
		inverted: false,
		description: "권한 관리 전체 권한 (deprecated)",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:settings:system",
		actionName: "manage",
		inverted: false,
		description: "시스템 설정 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:settings:ui-configs",
		actionName: "manage",
		inverted: false,
		description: "UI 설정 전체 권한",
	},

	// ============================================================================
	// 기능 manage
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "feature:export",
		actionName: "manage",
		inverted: false,
		description: "내보내기 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "feature:import",
		actionName: "manage",
		inverted: false,
		description: "가져오기 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "feature:bulk-delete",
		actionName: "manage",
		inverted: false,
		description: "일괄 삭제 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "feature:send-notification",
		actionName: "manage",
		inverted: false,
		description: "알림 발송 전체 권한",
	},

	// ============================================================================
	// FAB Quick Actions manage (v7.0)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "quickAction:todayReservation",
		actionName: "manage",
		inverted: false,
		description: "오늘 예약 바로가기 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "quickAction:quickReservation",
		actionName: "manage",
		inverted: false,
		description: "빠른 예약 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "quickAction:userSearch",
		actionName: "manage",
		inverted: false,
		description: "회원 검색 전체 권한",
	},

	// ============================================================================
	// 엔티티 manage
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "entity:User",
		actionName: "manage",
		inverted: false,
		description: "사용자 엔티티 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "entity:Ground",
		actionName: "manage",
		inverted: false,
		description: "시설 엔티티 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "entity:Space",
		actionName: "manage",
		inverted: false,
		description: "공간 엔티티 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "entity:Reservation",
		actionName: "manage",
		inverted: false,
		description: "예약 엔티티 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "entity:Content",
		actionName: "manage",
		inverted: false,
		description: "콘텐츠 엔티티 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "entity:Role",
		actionName: "manage",
		inverted: false,
		description: "역할 엔티티 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "entity:Ability",
		actionName: "manage",
		inverted: false,
		description: "권한 엔티티 전체 권한",
	},
];

/**
 * MANAGE 권한 시드 데이터
 * - 메뉴 access: 대시보드, 회원, 예약, 설정(일부)
 * - 엔티티: User, Reservation manage / Ground read, update
 * - inverted=true: 권한 관리 접근 불가
 */
export const manageAbilitySeedData: AbilitySeedData[] = [
	// 메뉴 access (1depth)
	{
		roleName: "MANAGE",
		subject: "menu:dashboard",
		actionName: "access",
		inverted: false,
		description: "대시보드 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:users",
		actionName: "access",
		inverted: false,
		description: "사용자 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:users:list",
		actionName: "access",
		inverted: false,
		description: "사용자 목록 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:users:profiles",
		actionName: "access",
		inverted: false,
		description: "프로필 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:users:categories",
		actionName: "access",
		inverted: false,
		description: "사용자 분류 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:users:groups",
		actionName: "access",
		inverted: false,
		description: "그룹 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:schedules",
		actionName: "access",
		inverted: false,
		description: "일정 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:schedules:timelines",
		actionName: "access",
		inverted: false,
		description: "타임라인 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:schedules:sessions",
		actionName: "access",
		inverted: false,
		description: "세션 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:schedules:programs",
		actionName: "access",
		inverted: false,
		description: "프로그램 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:schedules:routines",
		actionName: "access",
		inverted: false,
		description: "루틴 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:files",
		actionName: "access",
		inverted: false,
		description: "파일 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:files:list",
		actionName: "access",
		inverted: false,
		description: "파일 목록 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:files:categories",
		actionName: "access",
		inverted: false,
		description: "파일 분류 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:contents",
		actionName: "access",
		inverted: false,
		description: "콘텐츠 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:contents:posts",
		actionName: "access",
		inverted: false,
		description: "게시물 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:contents:list",
		actionName: "access",
		inverted: false,
		description: "콘텐츠 목록 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:wallets",
		actionName: "access",
		inverted: false,
		description: "지갑 관리 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:wallets:list",
		actionName: "access",
		inverted: false,
		description: "지갑 목록 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:wallets:transactions",
		actionName: "access",
		inverted: false,
		description: "트랜잭션 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:settings",
		actionName: "access",
		inverted: false,
		description: "설정 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:settings:spaces",
		actionName: "access",
		inverted: false,
		description: "시설 정보 접근 권한",
	},
	{
		roleName: "MANAGE",
		subject: "menu:settings:ui-configs",
		actionName: "access",
		inverted: false,
		description: "UI 설정 접근 권한",
	},
	// 권한 관리 접근 불가 (inverted=true)
	{
		roleName: "MANAGE",
		subject: "menu:settings:admins",
		actionName: "access",
		inverted: true,
		description: "관리자 관리 접근 불가",
	},
	{
		roleName: "MANAGE",
		subject: "menu:settings:abilities",
		actionName: "access",
		inverted: true,
		description: "권한 관리 접근 불가",
	},
	{
		roleName: "MANAGE",
		subject: "menu:settings:system",
		actionName: "access",
		inverted: true,
		description: "시스템 설정 접근 불가",
	},
	// 엔티티 권한
	{
		roleName: "MANAGE",
		subject: "entity:User",
		actionName: "manage",
		inverted: false,
		description: "사용자 엔티티 관리 권한",
	},
	{
		roleName: "MANAGE",
		subject: "entity:Reservation",
		actionName: "manage",
		inverted: false,
		description: "예약 엔티티 관리 권한",
	},
	{
		roleName: "MANAGE",
		subject: "entity:Ground",
		actionName: "read",
		inverted: false,
		description: "시설 조회 권한",
	},
	{
		roleName: "MANAGE",
		subject: "entity:Ground",
		actionName: "update",
		inverted: false,
		description: "시설 수정 권한",
	},
	{
		roleName: "MANAGE",
		subject: "entity:Content",
		actionName: "manage",
		inverted: false,
		description: "콘텐츠 관리 권한",
	},
	// 기능 권한
	{
		roleName: "MANAGE",
		subject: "feature:export",
		actionName: "access",
		inverted: false,
		description: "내보내기 권한",
	},
	{
		roleName: "MANAGE",
		subject: "feature:send-notification",
		actionName: "access",
		inverted: false,
		description: "알림 발송 권한",
	},
	// 일괄 삭제 불가 (inverted=true)
	{
		roleName: "MANAGE",
		subject: "feature:bulk-delete",
		actionName: "access",
		inverted: true,
		description: "일괄 삭제 불가",
	},
];

/**
 * VIEW 권한 시드 데이터
 * - 자신의 데이터만 read, update 가능 (conditions 사용)
 * - 자신의 예약만 create, read 가능
 */
export const viewAbilitySeedData: AbilitySeedData[] = [
	// 자신의 User 정보만 조회/수정 가능
	{
		roleName: "VIEW",
		subject: "entity:User",
		actionName: "read",
		inverted: false,
		description: "자신의 사용자 정보 조회 권한",
		conditions: { id: "{{ user.id }}" },
	},
	{
		roleName: "VIEW",
		subject: "entity:User",
		actionName: "update",
		inverted: false,
		description: "자신의 사용자 정보 수정 권한",
		conditions: { id: "{{ user.id }}" },
	},
	// 자신의 예약만 생성/조회 가능
	{
		roleName: "VIEW",
		subject: "entity:Reservation",
		actionName: "create",
		inverted: false,
		description: "예약 생성 권한",
	},
	{
		roleName: "VIEW",
		subject: "entity:Reservation",
		actionName: "read",
		inverted: false,
		description: "자신의 예약 조회 권한",
		conditions: { userId: "{{ user.id }}" },
	},
	{
		roleName: "VIEW",
		subject: "entity:Reservation",
		actionName: "update",
		inverted: false,
		description: "자신의 예약 수정 권한 (취소 등)",
		conditions: { userId: "{{ user.id }}" },
	},
	// 시설 정보 조회
	{
		roleName: "VIEW",
		subject: "entity:Ground",
		actionName: "read",
		inverted: false,
		description: "시설 정보 조회 권한",
	},
	// 콘텐츠 조회
	{
		roleName: "VIEW",
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
	...fullAccessAbilitySeedData,
	...manageAbilitySeedData,
	...viewAbilitySeedData,
];

/**
 * 권한 매핑 요약 (문서화용)
 *
 * FULL_ACCESS:
 * - 모든 Subject에 MANAGE 권한
 * - 제한 없음
 *
 * MANAGE:
 * - 메뉴: 대시보드, 사용자, 일정, 파일, 콘텐츠, 지갑, 설정(Ground정보, UI설정)
 * - CAN_NOT: 역할관리, 권한관리, 테넌트관리
 * - 엔티티: User MANAGE, Reservation MANAGE, Ground READ/UPDATE, Content MANAGE
 * - 기능: 내보내기, 알림발송 가능 / 일괄삭제 불가
 *
 * VIEW:
 * - 엔티티: 자신의 User READ/UPDATE, 자신의 Reservation CREATE/READ/UPDATE
 * - 엔티티: Ground READ, Content READ
 * - 메뉴/기능 접근 없음 (일반 사용자는 Admin 패널 미접근)
 */
export const permissionSummary = {
	FULL_ACCESS: {
		description: "시스템 전체 관리자",
		permissions: "모든 Subject에 MANAGE 권한",
	},
	MANAGE: {
		description: "지점 관리자",
		permissions:
			"사용자/일정/파일/콘텐츠/지갑 관리, Ground정보/UI설정 수정, 역할/권한/테넌트관리 접근불가",
	},
	VIEW: {
		description: "일반 사용자",
		permissions: "자신의 정보/예약만 접근, 시설/콘텐츠 조회",
	},
};
