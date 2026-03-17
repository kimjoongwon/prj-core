/**
 * Action 설정 타입 (config JSON 필드)
 */
export interface ActionConfigSeedData {
	type: "masking" | "format" | "transform";
	preset?: string; // 마스킹 프리셋: PRESET_EMAIL, PRESET_PHONE 등
	pattern?: string; // 커스텀 정규식
	replacement?: string; // 치환 문자열
	rule?: string; // 변환 규칙
}

/**
 * Action 시드 데이터 인터페이스
 */
export interface ActionSeedData {
	name: string; // Action 이름 (create, read, read:masked:email 등)
	displayName: string; // 한글 표시명
	description?: string; // 설명
	group: "crud" | "visibility" | "bulk" | "workflow"; // 그룹
	order?: number; // UI 정렬 순서
	isSystem?: boolean; // 시스템 기본 Action 여부
	config?: ActionConfigSeedData | null; // 마스킹, 포맷팅 등 설정
}

/**
 * Action 시드 데이터
 * DDD 원칙: Action이 완전한 정의를 가짐 (config에 마스킹 설정 포함)
 */
export const actionSeedData: ActionSeedData[] = [
	// ---- CRUD 액션 ----
	{
		name: "create",
		displayName: "생성",
		description: "새로운 리소스를 생성합니다",
		group: "crud",
		order: 0,
		isSystem: true,
		config: null,
	},
	{
		name: "read",
		displayName: "조회",
		description: "리소스를 조회합니다",
		group: "crud",
		order: 1,
		isSystem: true,
		config: null,
	},
	{
		name: "update",
		displayName: "수정",
		description: "리소스를 수정합니다",
		group: "crud",
		order: 2,
		isSystem: true,
		config: null,
	},
	{
		name: "delete",
		displayName: "삭제",
		description: "리소스를 삭제합니다",
		group: "crud",
		order: 3,
		isSystem: true,
		config: null,
	},
	{
		name: "manage",
		displayName: "전체 관리",
		description: "모든 권한을 가집니다",
		group: "crud",
		order: 4,
		isSystem: true,
		config: null,
	},

	// ---- Visibility 액션 ----
	{
		name: "read:full",
		displayName: "전체 조회",
		description: "마스킹 없이 전체 데이터를 조회합니다",
		group: "visibility",
		order: 10,
		isSystem: true,
		config: null,
	},
	{
		name: "read:hidden",
		displayName: "숨김",
		description: "데이터를 숨깁니다",
		group: "visibility",
		order: 11,
		isSystem: true,
		config: null,
	},
	{
		name: "read:masked:email",
		displayName: "이메일 마스킹 조회",
		description: "이메일을 마스킹하여 조회합니다 (예: u***@domain.com)",
		group: "visibility",
		order: 12,
		isSystem: true,
		config: { type: "masking", preset: "PRESET_EMAIL" },
	},
	{
		name: "read:masked:phone",
		displayName: "전화번호 마스킹 조회",
		description: "전화번호를 마스킹하여 조회합니다 (예: 010-****-5678)",
		group: "visibility",
		order: 13,
		isSystem: true,
		config: { type: "masking", preset: "PRESET_PHONE" },
	},
	{
		name: "read:masked:name",
		displayName: "이름 마스킹 조회",
		description: "이름을 마스킹하여 조회합니다 (예: 홍*동)",
		group: "visibility",
		order: 14,
		isSystem: true,
		config: { type: "masking", preset: "PRESET_NAME" },
	},
	{
		name: "read:masked:ssn",
		displayName: "주민번호 마스킹 조회",
		description: "주민번호를 마스킹하여 조회합니다 (예: 920315-*******)",
		group: "visibility",
		order: 15,
		isSystem: true,
		config: { type: "masking", preset: "PRESET_SSN" },
	},
	{
		name: "read:masked:card",
		displayName: "카드번호 마스킹 조회",
		description: "카드번호를 마스킹하여 조회합니다 (예: 1234-****-****-3456)",
		group: "visibility",
		order: 16,
		isSystem: true,
		config: { type: "masking", preset: "PRESET_CARD" },
	},
	{
		name: "read:masked:account",
		displayName: "계좌번호 마스킹 조회",
		description: "계좌번호를 마스킹하여 조회합니다",
		group: "visibility",
		order: 17,
		isSystem: true,
		config: { type: "masking", preset: "PRESET_ACCOUNT" },
	},

	// ---- Bulk 액션 ----
	{
		name: "export",
		displayName: "내보내기",
		description: "데이터를 내보냅니다",
		group: "bulk",
		order: 20,
		isSystem: true,
		config: null,
	},
	{
		name: "import",
		displayName: "가져오기",
		description: "데이터를 가져옵니다",
		group: "bulk",
		order: 21,
		isSystem: true,
		config: null,
	},

	// ---- Workflow 액션 ----
	{
		name: "access",
		displayName: "접근",
		description: "리소스에 접근합니다",
		group: "workflow",
		order: 30,
		isSystem: true,
		config: null,
	},
	{
		name: "approve",
		displayName: "승인",
		description: "리소스를 승인합니다",
		group: "workflow",
		order: 31,
		isSystem: true,
		config: null,
	},
	{
		name: "reject",
		displayName: "반려",
		description: "리소스를 반려합니다",
		group: "workflow",
		order: 32,
		isSystem: true,
		config: null,
	},
];

// ============================================================================
// Subject 시드 데이터 (CASL Subject 정의)
// ============================================================================

/**
 * Subject 시드 데이터 인터페이스
 */
export interface SubjectSeedData {
	name: string; // Subject 이름 (Prisma 모델명, 'all', 'menu:xxx', 'entity:xxx', 'feature:xxx', 'ui:xxx' 등)
	displayName: string; // 한글 표시명
	group: "all" | "entity" | "menu" | "feature" | "ui"; // 그룹핑
	order?: number; // UI 정렬 순서
	isSystem?: boolean; // 시스템 생성 여부 (DMMF 기반 = true)
}

/**
 * Subject 시드 데이터
 * - Prisma 모델 기반 Subject는 DMMF에서 자동 동기화됨
 * - 이 배열은 커스텀 Subject만 정의 (메뉴, 기능 등)
 *
 * v7.0 업데이트: Admin 메뉴 구조 변경
 * - menu:schedules → menu:sessions
 * - menu:settings → menu:spaces, menu:admins, menu:roles로 분리
 * - 예약, 알림, 문의, 템플릿 메뉴 추가
 */
export const subjectSeedData: SubjectSeedData[] = [
	// ---- 전체 ----
	{ name: "all", displayName: "전체", group: "all", order: 0 },

	// ---- 엔티티 (Prisma 모델 기반) ----
	// DMMF에서 자동 동기화되므로 여기서는 entity: 접두사가 붙은 것들만 정의
	{ name: "entity:User", displayName: "사용자", group: "entity", order: 1 },
	{ name: "entity:Ground", displayName: "시설", group: "entity", order: 2 },
	{ name: "entity:Space", displayName: "공간", group: "entity", order: 3 },
	{
		name: "entity:Reservation",
		displayName: "예약",
		group: "entity",
		order: 4,
	},
	{ name: "entity:Content", displayName: "콘텐츠", group: "entity", order: 5 },
	{ name: "entity:Role", displayName: "역할", group: "entity", order: 6 },
	{ name: "entity:Ability", displayName: "권한", group: "entity", order: 7 },

	// ============================================================================
	// v7.0 Admin 메뉴 (1depth)
	// ============================================================================
	{
		name: "menu:dashboard",
		displayName: "대시보드",
		group: "menu",
		order: 100,
	},
	{ name: "menu:users", displayName: "회원", group: "menu", order: 110 },
	{ name: "menu:reservations", displayName: "예약", group: "menu", order: 120 },
	{
		name: "menu:notifications",
		displayName: "알림",
		group: "menu",
		order: 130,
	},
	{ name: "menu:inquiries", displayName: "문의", group: "menu", order: 140 },
	{ name: "menu:contents", displayName: "콘텐츠", group: "menu", order: 150 },
	{ name: "menu:templates", displayName: "템플릿", group: "menu", order: 160 },
	{ name: "menu:sessions", displayName: "세션", group: "menu", order: 170 },
	{ name: "menu:spaces", displayName: "시설", group: "menu", order: 180 },
	{ name: "menu:admins", displayName: "관리자", group: "menu", order: 190 },
	{ name: "menu:roles", displayName: "역할/권한", group: "menu", order: 200 },
	// 현재 admin-menu.ts 메뉴 구조에 맞는 추가 subjects
	{
		name: "menu:spaces:list",
		displayName: "시설 목록",
		group: "menu",
		order: 181,
	},
	{
		name: "menu:timelines",
		displayName: "일정 관리",
		group: "menu",
		order: 210,
	},
	{
		name: "menu:timelines:list",
		displayName: "타임라인 목록",
		group: "menu",
		order: 211,
	},
	{
		name: "menu:tasks",
		displayName: "운동 관리",
		group: "menu",
		order: 220,
	},
	{
		name: "menu:tasks:list",
		displayName: "운동 종목 목록",
		group: "menu",
		order: 221,
	},
	{ name: "menu:routines", displayName: "루틴", group: "menu", order: 230 },
	{
		name: "menu:routines:list",
		displayName: "루틴 목록",
		group: "menu",
		order: 231,
	},
	{
		name: "menu:templates:list",
		displayName: "템플릿 목록",
		group: "menu",
		order: 161,
	},
	{
		name: "menu:role-groups",
		displayName: "역할 그룹",
		group: "menu",
		order: 202,
	},
	{
		name: "menu:role-groups:list",
		displayName: "역할 그룹 목록",
		group: "menu",
		order: 203,
	},
	{
		name: "menu:role-categories",
		displayName: "역할 카테고리",
		group: "menu",
		order: 204,
	},
	{
		name: "menu:role-categories:list",
		displayName: "역할 카테고리 목록",
		group: "menu",
		order: 205,
	},
	{
		name: "menu:abilities",
		displayName: "권한 정의",
		group: "menu",
		order: 206,
	},
	{
		name: "menu:abilities:list",
		displayName: "권한 정의 목록",
		group: "menu",
		order: 207,
	},
	{ name: "menu:actions", displayName: "액션", group: "menu", order: 208 },
	{
		name: "menu:actions:list",
		displayName: "액션 목록",
		group: "menu",
		order: 209,
	},
	{ name: "menu:subjects", displayName: "대상", group: "menu", order: 212 },
	{
		name: "menu:subjects:list",
		displayName: "대상 목록",
		group: "menu",
		order: 213,
	},
	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 회원)
	// ============================================================================
	{
		name: "menu:users:list",
		displayName: "회원 목록",
		group: "menu",
		order: 111,
	},
	{
		name: "menu:users:grades",
		displayName: "등급 관리",
		group: "menu",
		order: 112,
	},
	{
		name: "menu:users:withdrawn",
		displayName: "탈퇴 회원",
		group: "menu",
		order: 113,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 예약)
	// ============================================================================
	{
		name: "menu:reservations:today",
		displayName: "오늘 예약",
		group: "menu",
		order: 121,
	},
	{
		name: "menu:reservations:list",
		displayName: "예약 목록",
		group: "menu",
		order: 122,
	},
	{
		name: "menu:reservations:calendar",
		displayName: "캘린더",
		group: "menu",
		order: 123,
	},
	{
		name: "menu:reservations:stats",
		displayName: "통계",
		group: "menu",
		order: 124,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 알림)
	// ============================================================================
	{
		name: "menu:notifications:send",
		displayName: "알림 발송",
		group: "menu",
		order: 131,
	},
	{
		name: "menu:notifications:history",
		displayName: "발송 내역",
		group: "menu",
		order: 132,
	},
	{
		name: "menu:notifications:templates",
		displayName: "알림 템플릿",
		group: "menu",
		order: 133,
	},
	{
		name: "menu:notifications:settings",
		displayName: "알림 설정",
		group: "menu",
		order: 134,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 문의)
	// ============================================================================
	{
		name: "menu:inquiries:list",
		displayName: "문의 목록",
		group: "menu",
		order: 141,
	},
	{
		name: "menu:inquiries:direct",
		displayName: "1:1 문의",
		group: "menu",
		order: 142,
	},
	{
		name: "menu:inquiries:answered",
		displayName: "답변 완료",
		group: "menu",
		order: 143,
	},
	{
		name: "menu:inquiries:faq",
		displayName: "FAQ",
		group: "menu",
		order: 144,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 콘텐츠)
	// ============================================================================
	{
		name: "menu:contents:notices",
		displayName: "공지사항",
		group: "menu",
		order: 151,
	},
	{
		name: "menu:contents:banners",
		displayName: "배너",
		group: "menu",
		order: 152,
	},
	{
		name: "menu:contents:events",
		displayName: "이벤트",
		group: "menu",
		order: 153,
	},
	{
		name: "menu:contents:terms",
		displayName: "이용약관",
		group: "menu",
		order: 154,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 템플릿)
	// ============================================================================
	{
		name: "menu:templates:sms",
		displayName: "SMS",
		group: "menu",
		order: 161,
	},
	{
		name: "menu:templates:email",
		displayName: "이메일",
		group: "menu",
		order: 162,
	},
	{
		name: "menu:templates:push",
		displayName: "푸시",
		group: "menu",
		order: 163,
	},
	{
		name: "menu:templates:html",
		displayName: "HTML",
		group: "menu",
		order: 164,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 세션)
	// ============================================================================
	{
		name: "menu:sessions:timelines",
		displayName: "타임라인",
		group: "menu",
		order: 171,
	},
	{
		name: "menu:sessions:list",
		displayName: "세션 목록",
		group: "menu",
		order: 172,
	},
	{
		name: "menu:sessions:programs",
		displayName: "프로그램 배정",
		group: "menu",
		order: 173,
	},
	{
		name: "menu:sessions:routines",
		displayName: "루틴",
		group: "menu",
		order: 174,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 시설)
	// ============================================================================
	{
		name: "menu:spaces:info",
		displayName: "시설 정보",
		group: "menu",
		order: 181,
	},
	{
		name: "menu:spaces:programs",
		displayName: "프로그램 정의",
		group: "menu",
		order: 182,
	},
	{
		name: "menu:spaces:equipment",
		displayName: "장비/시설물",
		group: "menu",
		order: 183,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 관리자)
	// ============================================================================
	{
		name: "menu:admins:list",
		displayName: "관리자 목록",
		group: "menu",
		order: 191,
	},
	{
		name: "menu:admins:invitations",
		displayName: "초대 관리",
		group: "menu",
		order: 192,
	},

	// ============================================================================
	// v7.0 Admin 메뉴 (2depth - 역할/권한)
	// ============================================================================
	{
		name: "menu:roles:list",
		displayName: "역할 목록",
		group: "menu",
		order: 201,
	},
	{
		name: "menu:roles:abilities",
		displayName: "권한 설정",
		group: "menu",
		order: 202,
	},

	// ============================================================================
	// 레거시 메뉴 (하위 호환성 - deprecated)
	// ============================================================================
	{
		name: "menu:schedules",
		displayName: "일정 관리 (deprecated)",
		group: "menu",
		order: 900,
	},
	{ name: "menu:files", displayName: "파일 관리", group: "menu", order: 901 },
	{ name: "menu:wallets", displayName: "지갑 관리", group: "menu", order: 902 },
	{
		name: "menu:settings",
		displayName: "설정 (deprecated)",
		group: "menu",
		order: 903,
	},
	{
		name: "menu:users:profiles",
		displayName: "프로필 관리",
		group: "menu",
		order: 910,
	},
	{
		name: "menu:users:categories",
		displayName: "사용자 분류",
		group: "menu",
		order: 911,
	},
	{
		name: "menu:users:groups",
		displayName: "그룹 관리",
		group: "menu",
		order: 912,
	},
	{
		name: "menu:schedules:timelines",
		displayName: "타임라인 (deprecated)",
		group: "menu",
		order: 920,
	},
	{
		name: "menu:schedules:sessions",
		displayName: "세션 (deprecated)",
		group: "menu",
		order: 921,
	},
	{
		name: "menu:schedules:programs",
		displayName: "프로그램 (deprecated)",
		group: "menu",
		order: 922,
	},
	{
		name: "menu:schedules:routines",
		displayName: "루틴 (deprecated)",
		group: "menu",
		order: 923,
	},
	{
		name: "menu:files:list",
		displayName: "파일 목록",
		group: "menu",
		order: 930,
	},
	{
		name: "menu:files:categories",
		displayName: "파일 분류",
		group: "menu",
		order: 931,
	},
	{
		name: "menu:contents:posts",
		displayName: "게시물",
		group: "menu",
		order: 940,
	},
	{
		name: "menu:contents:list",
		displayName: "콘텐츠 목록",
		group: "menu",
		order: 941,
	},
	{
		name: "menu:wallets:list",
		displayName: "지갑 목록",
		group: "menu",
		order: 950,
	},
	{
		name: "menu:wallets:transactions",
		displayName: "트랜잭션",
		group: "menu",
		order: 951,
	},
	{
		name: "menu:settings:spaces",
		displayName: "시설 정보 (deprecated)",
		group: "menu",
		order: 960,
	},
	{
		name: "menu:settings:admins",
		displayName: "관리자 관리 (deprecated)",
		group: "menu",
		order: 961,
	},
	{
		name: "menu:settings:abilities",
		displayName: "권한 관리 (deprecated)",
		group: "menu",
		order: 962,
	},
	{
		name: "menu:settings:system",
		displayName: "시스템 설정",
		group: "menu",
		order: 963,
	},
	{
		name: "menu:settings:ui-configs",
		displayName: "UI 설정",
		group: "menu",
		order: 964,
	},

	// ============================================================================
	// 기능
	// ============================================================================
	{
		name: "feature:export",
		displayName: "내보내기",
		group: "feature",
		order: 1000,
	},
	{
		name: "feature:import",
		displayName: "가져오기",
		group: "feature",
		order: 1001,
	},
	{
		name: "feature:bulk-delete",
		displayName: "일괄 삭제",
		group: "feature",
		order: 1002,
	},
	{
		name: "feature:send-notification",
		displayName: "알림 발송",
		group: "feature",
		order: 1003,
	},

	// ============================================================================
	// FAB Quick Actions (v7.0)
	// ============================================================================
	{
		name: "quickAction:todayReservation",
		displayName: "오늘 예약 바로가기",
		group: "feature",
		order: 1100,
	},
	{
		name: "quickAction:quickReservation",
		displayName: "빠른 예약",
		group: "feature",
		order: 1101,
	},
	{
		name: "quickAction:userSearch",
		displayName: "회원 검색",
		group: "feature",
		order: 1102,
	},

	// ============================================================================
	// UI 요소
	// ============================================================================
	{
		name: "ui:mobile-bottom-tab",
		displayName: "모바일 바텀탭",
		group: "ui",
		order: 1200,
	},
	{
		name: "ui:mobile-bottom-tab:home",
		displayName: "바텀탭 - 홈",
		group: "ui",
		order: 1201,
	},
	{
		name: "ui:mobile-bottom-tab:schedule",
		displayName: "바텀탭 - 일정",
		group: "ui",
		order: 1202,
	},
	{
		name: "ui:mobile-bottom-tab:my",
		displayName: "바텀탭 - 마이페이지",
		group: "ui",
		order: 1203,
	},
	{
		name: "ui:mobile-bottom-tab:settings",
		displayName: "바텀탭 - 설정",
		group: "ui",
		order: 1204,
	},
	{
		name: "ui:main-banner",
		displayName: "메인 배너",
		group: "ui",
		order: 1210,
	},
	{
		name: "ui:sidebar-menu",
		displayName: "사이드바 메뉴",
		group: "ui",
		order: 1220,
	},
	{
		name: "ui:sidebar-menu:admin",
		displayName: "사이드바 - 관리자 메뉴",
		group: "ui",
		order: 1221,
	},
	{
		name: "ui:floating-button:chat",
		displayName: "플로팅 채팅 버튼",
		group: "ui",
		order: 1230,
	},
	{
		name: "ui:floating-button:help",
		displayName: "플로팅 도움말 버튼",
		group: "ui",
		order: 1231,
	},
];
