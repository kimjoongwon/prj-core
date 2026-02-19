// Enum imports
import {
	RoleCategoryNames,
	RoleGroupNames,
	SpaceCategoryNames,
	SpaceGroupNames,
} from "@cocrepo/enum";

// ============================================================================
// Action 시드 데이터 (CASL Action 정의)
// ============================================================================

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
 * - menu:settings → menu:grounds, menu:admins, menu:roles로 분리
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
	{ name: "menu:grounds", displayName: "시설", group: "menu", order: 180 },
	{ name: "menu:admins", displayName: "관리자", group: "menu", order: 190 },
	{ name: "menu:roles", displayName: "역할/권한", group: "menu", order: 200 },
	// 현재 admin-menu.ts 메뉴 구조에 맞는 추가 subjects
	{ name: "menu:grounds:list", displayName: "시설 목록", group: "menu", order: 181 },
	{ name: "menu:timelines", displayName: "일정 관리", group: "menu", order: 210 },
	{ name: "menu:timelines:list", displayName: "타임라인 목록", group: "menu", order: 211 },
	{ name: "menu:exercises", displayName: "운동 관리", group: "menu", order: 220 },
	{ name: "menu:exercises:list", displayName: "운동 종목 목록", group: "menu", order: 221 },
	{ name: "menu:routines", displayName: "루틴", group: "menu", order: 230 },
	{ name: "menu:routines:list", displayName: "루틴 목록", group: "menu", order: 231 },
	{ name: "menu:templates:list", displayName: "템플릿 목록", group: "menu", order: 161 },
	{ name: "menu:role-groups", displayName: "역할 그룹", group: "menu", order: 202 },
	{ name: "menu:role-groups:list", displayName: "역할 그룹 목록", group: "menu", order: 203 },
	{ name: "menu:role-categories", displayName: "역할 카테고리", group: "menu", order: 204 },
	{ name: "menu:role-categories:list", displayName: "역할 카테고리 목록", group: "menu", order: 205 },
	{ name: "menu:abilities", displayName: "권한 정의", group: "menu", order: 206 },
	{ name: "menu:abilities:list", displayName: "권한 정의 목록", group: "menu", order: 207 },
	{ name: "menu:actions", displayName: "액션", group: "menu", order: 208 },
	{ name: "menu:actions:list", displayName: "액션 목록", group: "menu", order: 209 },
	{ name: "menu:subjects", displayName: "대상", group: "menu", order: 212 },
	{ name: "menu:subjects:list", displayName: "대상 목록", group: "menu", order: 213 },
	{ name: "menu:my-account", displayName: "내 계정", group: "menu", order: 300 },
	{ name: "menu:my-account:sessions", displayName: "세션 관리", group: "menu", order: 301 },
	{ name: "menu:my-account:change-password", displayName: "비밀번호 변경", group: "menu", order: 302 },

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
		name: "menu:grounds:info",
		displayName: "시설 정보",
		group: "menu",
		order: 181,
	},
	{
		name: "menu:grounds:programs",
		displayName: "프로그램 정의",
		group: "menu",
		order: 182,
	},
	{
		name: "menu:grounds:equipment",
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
		name: "menu:settings:grounds",
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

// 시드 데이터를 위한 메타데이터
export interface UserSeedData {
	email: string;
	phone: string;
	password: string;
	profile: {
		name: string;
		nickname: string;
	};
	role?: string;
}

export interface GroundSeedData {
	name: string;
	label: string;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
	isSystem?: boolean; // System Space에 연결되는 Ground
}

// 10명의 다양한 역할 유저 데이터 (FULL_ACCESS 1명, MANAGE 3명, VIEW 6명)
export const userSeedData: UserSeedData[] = [
	// FULL_ACCESS 1명 - 플랫폼 관리자
	{
		email: "admin@plate.com",
		phone: "01073162347",
		password: "rkdmf12!@",
		profile: {
			name: "Super Admin",
			nickname: "플레이트",
		},
		role: "FULL_ACCESS",
	},
	// MANAGE 3명 - 각 지점 관리자
	{
		email: "manager.gwanghwamun@f45.kr",
		phone: "01023456789",
		password: "Admin123!@#",
		profile: {
			name: "이점장",
			nickname: "광화문점장",
		},
		role: "MANAGE",
	},
	{
		email: "manager.gangnam@f45.kr",
		phone: "01034567890",
		password: "Admin123!@#",
		profile: {
			name: "박매니저",
			nickname: "강남매니저",
		},
		role: "MANAGE",
	},
	{
		email: "manager.itaewon@crossfit.kr",
		phone: "01045678901",
		password: "Admin123!@#",
		profile: {
			name: "최코치",
			nickname: "이태원코치",
		},
		role: "MANAGE",
	},
	// VIEW 6명 - 실제 회원들
	{
		email: "minsu.kim92@gmail.com",
		phone: "01056789012",
		password: "User123!@#",
		profile: {
			name: "김민수",
			nickname: "민수",
		},
		role: "VIEW",
	},
	{
		email: "seoyeon_lee@naver.com",
		phone: "01067890123",
		password: "User123!@#",
		profile: {
			name: "이서연",
			nickname: "서연",
		},
		role: "VIEW",
	},
	{
		email: "yejun.park@kakao.com",
		phone: "01078901234",
		password: "User123!@#",
		profile: {
			name: "박예준",
			nickname: "예준",
		},
		role: "VIEW",
	},
	{
		email: "jiwoo0315@gmail.com",
		phone: "01089012345",
		password: "User123!@#",
		profile: {
			name: "최지우",
			nickname: "지우",
		},
		role: "VIEW",
	},
	{
		email: "hayoon.jung@naver.com",
		phone: "01090123456",
		password: "User123!@#",
		profile: {
			name: "정하윤",
			nickname: "하윤",
		},
		role: "VIEW",
	},
	{
		email: "doyoon.kang@gmail.com",
		phone: "01001234567",
		password: "User123!@#",
		profile: {
			name: "강도윤",
			nickname: "도윤",
		},
		role: "VIEW",
	},
];

// 현실적인 피트니스 센터 그라운드 데이터 (11개: System 1 + Branch 10)
export const groundSeedData: GroundSeedData[] = [
	// 플랫폼 운영본부 (System Space Ground)
	{
		name: "플랫폼 운영본부",
		label: "본사",
		address: "서울시 강남구",
		phone: "02-0000-0000",
		email: "admin@plate.com",
		businessNo: "000-00-00000",
		isSystem: true,
	},
	// F45 Training 지점들
	{
		name: "F45 광화문",
		label: "본점",
		address: "서울시 종로구 세종대로 175 광화문D타워 B1",
		phone: "02-1234-5678",
		email: "gwanghwamun@f45training.co.kr",
		businessNo: "101-86-12345",
	},
	{
		name: "F45 강남1호",
		label: "지점",
		address: "서울시 강남구 테헤란로 152 강남파이낸스센터 B2",
		phone: "02-2345-6789",
		email: "gangnam1@f45training.co.kr",
		businessNo: "102-86-23456",
	},
	{
		name: "F45 삼성",
		label: "지점",
		address: "서울시 강남구 삼성로 512 삼성타워 B1",
		phone: "02-3456-7890",
		email: "samsung@f45training.co.kr",
		businessNo: "103-86-34567",
	},
	{
		name: "F45 잠실",
		label: "지점",
		address: "서울시 송파구 올림픽로 300 롯데월드타워 B2",
		phone: "02-4567-8901",
		email: "jamsil@f45training.co.kr",
		businessNo: "104-86-45678",
	},
	// 크로스핏 박스들
	{
		name: "크로스핏 이태원",
		label: "본점",
		address: "서울시 용산구 이태원로 200 크로스핏빌딩 2층",
		phone: "02-5678-9012",
		email: "itaewon@crossfit.kr",
		businessNo: "201-87-56789",
	},
	{
		name: "크로스핏 마포",
		label: "지점",
		address: "서울시 마포구 양화로 45 메세나폴리스 B1",
		phone: "02-6789-0123",
		email: "mapo@crossfit.kr",
		businessNo: "202-87-67890",
	},
	// 애니타임 피트니스
	{
		name: "애니타임피트니스 역삼",
		label: "본점",
		address: "서울시 강남구 역삼로 134 역삼빌딩 3층",
		phone: "02-7890-1234",
		email: "yeoksam@anytimefitness.kr",
		businessNo: "301-88-78901",
	},
	{
		name: "애니타임피트니스 신논현",
		label: "지점",
		address: "서울시 강남구 강남대로 472 신논현타워 4층",
		phone: "02-8901-2345",
		email: "sinnonhyeon@anytimefitness.kr",
		businessNo: "302-88-89012",
	},
	// 스포애니
	{
		name: "스포애니 홍대",
		label: "본점",
		address: "서울시 마포구 홍익로 25 홍대스포츠센터 2층",
		phone: "02-9012-3456",
		email: "hongdae@spoany.co.kr",
		businessNo: "401-89-90123",
	},
	{
		name: "스포애니 건대",
		label: "지점",
		address: "서울시 광진구 능동로 120 건대입구역빌딩 B1",
		phone: "02-0123-4567",
		email: "kondae@spoany.co.kr",
		businessNo: "402-89-01234",
	},
];

// Role 타입 카테고리 시드 데이터 (RoleCategoryNames enum 활용)
export interface CategorySeedData {
	roleCategoryEnum: RoleCategoryNames;
	type: "Role" | "Space" | "File" | "User";
	parentId?: string;
}

export const roleCategorySeedData: CategorySeedData[] = [
	{
		roleCategoryEnum: RoleCategoryNames.PLATFORM,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.SHARED,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.PUBLIC,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.WORKSPACE,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.PROJECT,
		type: "Role",
	},
];

// Role 시드 데이터 (role.prisma의 Role 모델에 대응)
export interface RoleSeedData {
	name: string;
	displayName: string;
	description: string;
	isSystem: boolean;
}

export const roleSeedData: RoleSeedData[] = [
	{
		name: "FULL_ACCESS",
		displayName: "전체 접근",
		description: "시스템의 모든 권한을 가진 전체 접근 역할",
		isSystem: true,
	},
	{
		name: "MANAGE",
		displayName: "관리",
		description: "관리 업무를 수행하는 역할",
		isSystem: true,
	},
	{
		name: "VIEW",
		displayName: "조회",
		description: "기본 조회 역할",
		isSystem: true,
	},
];

// RoleClassification 시드 데이터 (Role과 Category type="Role" 연결)
// role.prisma의 RoleClassification 모델: categoryId, roleId로 연결

export interface RoleClassificationSeedData {
	roleName: string;
	roleCategoryEnum: RoleCategoryNames; // RoleCategoryNames enum 사용
}

export const roleClassificationSeedData: RoleClassificationSeedData[] = [
	{
		roleName: "FULL_ACCESS",
		roleCategoryEnum: RoleCategoryNames.PLATFORM, // "플랫폼" 카테고리
	},
	{
		roleName: "MANAGE",
		roleCategoryEnum: RoleCategoryNames.WORKSPACE, // "워크스페이스" 카테고리
	},
	{
		roleName: "VIEW",
		roleCategoryEnum: RoleCategoryNames.PUBLIC, // "공개" 카테고리
	},
];

// Role Group 시드 데이터 (RoleGroupNames enum 활용)

export interface RoleGroupSeedData {
	roleGroupEnum: RoleGroupNames;
}

export const roleGroupSeedData: RoleGroupSeedData[] = [
	{
		roleGroupEnum: RoleGroupNames.TRUSTED,
	},
	{
		roleGroupEnum: RoleGroupNames.STANDARD,
	},
	{
		roleGroupEnum: RoleGroupNames.PREMIUM,
	},
];

// Role과 Group 연결 (RoleAssociation) 시드 데이터
export interface RoleAssociationSeedData {
	roleName: string;
	roleGroupEnum: RoleGroupNames;
}

export const roleAssociationSeedData: RoleAssociationSeedData[] = [
	// FULL_ACCESS는 TRUSTED 그룹
	{
		roleName: "FULL_ACCESS",
		roleGroupEnum: RoleGroupNames.TRUSTED,
	},
	// MANAGE는 PREMIUM 그룹
	{
		roleName: "MANAGE",
		roleGroupEnum: RoleGroupNames.PREMIUM,
	},
	// VIEW는 STANDARD 그룹
	{
		roleName: "VIEW",
		roleGroupEnum: RoleGroupNames.STANDARD,
	},
];

// 유저-그라운드 매핑 인터페이스
export interface UserGroundMappingData {
	userEmail: string;
	groundNames: string[];
}

// 유저와 그라운드 매핑 (정합성 보장 - 역할에 맞는 논리적 연결)
export const userGroundMapping: UserGroundMappingData[] = [
	// FULL_ACCESS - 플랫폼 운영본부 (System Space)
	{
		userEmail: "admin@plate.com",
		groundNames: ["플랫폼 운영본부"],
	},
	// MANAGE - 담당 지점만 (F45 계열)
	{
		userEmail: "manager.gwanghwamun@f45.kr",
		groundNames: ["F45 광화문"],
	},
	{
		userEmail: "manager.gangnam@f45.kr",
		groundNames: ["F45 강남1호", "F45 삼성"], // 강남 지역 담당
	},
	// MANAGE - 크로스핏 담당
	{
		userEmail: "manager.itaewon@crossfit.kr",
		groundNames: ["크로스핏 이태원", "크로스핏 마포"],
	},
	// VIEW - 가입한 지점 (일반 회원)
	{
		userEmail: "minsu.kim92@gmail.com",
		groundNames: ["F45 광화문"], // 광화문 회원
	},
	{
		userEmail: "seoyeon_lee@naver.com",
		groundNames: ["F45 강남1호"], // 강남 회원
	},
	{
		userEmail: "yejun.park@kakao.com",
		groundNames: ["크로스핏 이태원"], // 크로스핏 회원
	},
	{
		userEmail: "jiwoo0315@gmail.com",
		groundNames: ["애니타임피트니스 역삼", "애니타임피트니스 신논현"], // 다중 지점 회원
	},
	{
		userEmail: "hayoon.jung@naver.com",
		groundNames: ["스포애니 홍대"], // 스포애니 회원
	},
	{
		userEmail: "doyoon.kang@gmail.com",
		groundNames: ["F45 잠실", "스포애니 건대"], // 다중 브랜드 회원 (엣지 케이스)
	},
];

// ============================================================
// Agreement (약관) 시드 데이터
// ============================================================

export type AgreementType =
	| "TERMS_OF_SERVICE"
	| "PRIVACY_POLICY"
	| "MARKETING_CONSENT"
	| "LOCATION_CONSENT"
	| "THIRD_PARTY_SHARING";

export interface AgreementSeedData {
	title: string;
	type: AgreementType;
	version: string;
	isRequired: boolean;
	content: string;
}

export const agreementSeedData: AgreementSeedData[] = [
	{
		title: "서비스 이용약관",
		type: "TERMS_OF_SERVICE",
		version: "1.0.0",
		isRequired: true,
		content: `제1조 (목적)
이 약관은 F45 Training Korea(이하 "회사")가 제공하는 피트니스 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.

제2조 (용어의 정의)
1. "서비스"란 회사가 제공하는 피트니스 관련 서비스를 말합니다.
2. "회원"이란 이 약관에 동의하고 서비스를 이용하는 자를 말합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.
2. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.`,
	},
	{
		title: "개인정보 처리방침",
		type: "PRIVACY_POLICY",
		version: "1.0.0",
		isRequired: true,
		content: `1. 개인정보의 수집 및 이용 목적
회사는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.
- 회원 가입 및 관리
- 서비스 제공 및 계약 이행
- 고객 상담 및 불만 처리

2. 수집하는 개인정보 항목
- 필수항목: 이름, 이메일, 휴대폰 번호
- 선택항목: 생년월일, 성별

3. 개인정보의 보유 및 이용기간
회원 탈퇴 시까지 (단, 관련 법령에 따라 보존이 필요한 경우 해당 기간)`,
	},
	{
		title: "마케팅 정보 수신 동의",
		type: "MARKETING_CONSENT",
		version: "1.0.0",
		isRequired: false,
		content: `마케팅 정보 수신에 동의하시면 다음과 같은 혜택을 받으실 수 있습니다.

1. 수신 정보
- 신규 프로그램 및 이벤트 안내
- 프로모션 및 할인 정보
- 피트니스 팁 및 건강 정보

2. 수신 방법
- SMS/MMS
- 이메일
- 앱 푸시 알림

※ 동의하지 않아도 서비스 이용에는 제한이 없습니다.
※ 동의 후에도 언제든지 수신 거부할 수 있습니다.`,
	},
	{
		title: "위치 기반 서비스 이용약관",
		type: "LOCATION_CONSENT",
		version: "1.0.0",
		isRequired: false,
		content: `1. 위치정보의 수집 목적
- 가까운 지점 안내
- 출석 체크 (지점 방문 확인)

2. 위치정보의 보유기간
- 서비스 이용 중에만 수집되며, 목적 달성 후 즉시 파기됩니다.

3. 위치정보 수집 거부권
- 위치정보 수집에 동의하지 않아도 기본 서비스 이용이 가능합니다.
- 다만, 위치 기반 서비스(가까운 지점 찾기 등)는 이용이 제한됩니다.`,
	},
];

// 유저-약관동의 매핑 인터페이스
export interface UserAgreementMappingData {
	userEmail: string;
	agreements: AgreementType[];
}

// 유저와 약관 동의 매핑 (정합성 보장)
// FULL_ACCESS(admin@plate.com)은 별도로 약관 동의하지 않음 (시스템 관리자)
export const userAgreementMapping: UserAgreementMappingData[] = [
	// MANAGE들 - 필수 + 마케팅 동의
	{
		userEmail: "manager.gwanghwamun@f45.kr",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "MARKETING_CONSENT"],
	},
	{
		userEmail: "manager.gangnam@f45.kr",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "MARKETING_CONSENT"],
	},
	{
		userEmail: "manager.itaewon@crossfit.kr",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "LOCATION_CONSENT"],
	},
	// VIEW들 - 다양한 동의 패턴 (테스트 시나리오)
	{
		userEmail: "minsu.kim92@gmail.com",
		agreements: [
			"TERMS_OF_SERVICE",
			"PRIVACY_POLICY",
			"MARKETING_CONSENT",
			"LOCATION_CONSENT",
		], // 모든 동의
	},
	{
		userEmail: "seoyeon_lee@naver.com",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY"], // 필수만 동의
	},
	{
		userEmail: "yejun.park@kakao.com",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "MARKETING_CONSENT"], // 마케팅만 추가
	},
	{
		userEmail: "jiwoo0315@gmail.com",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "LOCATION_CONSENT"], // 위치만 추가
	},
	{
		userEmail: "hayoon.jung@naver.com",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY"], // 필수만 동의
	},
	{
		userEmail: "doyoon.kang@gmail.com",
		agreements: [
			"TERMS_OF_SERVICE",
			"PRIVACY_POLICY",
			"MARKETING_CONSENT",
			"LOCATION_CONSENT",
		], // 모든 동의
	},
];

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
		subject: "menu:grounds",
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
		subject: "menu:grounds:info",
		actionName: "manage",
		inverted: false,
		description: "시설 정보 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:grounds:programs",
		actionName: "manage",
		inverted: false,
		description: "프로그램 정의 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:grounds:equipment",
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
	// v7.1 신규 메뉴 manage (1depth - 일정/운동/루틴/내 계정)
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
		subject: "menu:exercises",
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
	{
		roleName: "FULL_ACCESS",
		subject: "menu:my-account",
		actionName: "manage",
		inverted: false,
		description: "내 계정 전체 권한",
	},

	// ============================================================================
	// v7.1 신규 메뉴 manage (2depth - 시설 목록)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:grounds:list",
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
		subject: "menu:exercises:list",
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
	// v7.1 신규 메뉴 manage (2depth - 내 계정)
	// ============================================================================
	{
		roleName: "FULL_ACCESS",
		subject: "menu:my-account:sessions",
		actionName: "manage",
		inverted: false,
		description: "세션 관리 전체 권한",
	},
	{
		roleName: "FULL_ACCESS",
		subject: "menu:my-account:change-password",
		actionName: "manage",
		inverted: false,
		description: "비밀번호 변경 전체 권한",
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
		subject: "menu:settings:grounds",
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
		subject: "menu:settings:grounds",
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

// ============================================================================
// Role-Subject-Ability 매핑 요약
// ============================================================================

// ============================================================================
// OIDC Client 시드 데이터
// ============================================================================

/**
 * OIDC Client 시드 데이터 인터페이스
 */
export interface OidcClientSeedData {
	clientId: string;
	clientSecret: string | null;
	clientName: string;
	redirectUris: string[];
	grantTypes: string[];
	responseTypes: string[];
	tokenEndpointAuthMethod: string;
	scope: string;
	isActive: boolean;
	logoUri?: string | null;
	policyUri?: string | null;
	tosUri?: string | null;
}

/**
 * OIDC Client 시드 데이터
 * 기본 클라이언트 애플리케이션 정의
 */
export const oidcClientSeedData: OidcClientSeedData[] = [
	{
		clientId: "prj-core-admin",
		clientSecret: "admin-secret-change-in-production",
		clientName: "PRJ Core Admin",
		redirectUris: [
			"http://localhost:3000/api/v1/auth/callback",
			"http://localhost:3001/api/v1/auth/callback",
		],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email roles",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "prj-core-mobile",
		clientSecret: null, // Public client (PKCE required)
		clientName: "PRJ Core Mobile App",
		redirectUris: [
			"prjcore://auth/callback",
			"exp://localhost:8081/--/auth/callback",
		],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none", // Public client
		scope: "openid profile email",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "prj-core-idp-console",
		clientSecret: "idp-console-secret-change-in-production",
		clientName: "PRJ Core IDP 관리 콘솔",
		redirectUris: [
			"http://localhost:3008/api/v1/auth/callback",
		],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email roles",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "prj-core-swagger",
		clientSecret: null,
		clientName: "PRJ Core Swagger UI",
		redirectUris: ["http://localhost:3006/api/oauth2-redirect.html"],
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none",
		scope: "openid profile email roles",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
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

// ============================================================================
// Space Category 시드 데이터 (SpaceCategoryNames enum 활용)
// ============================================================================

export interface SpaceCategorySeedData {
	spaceCategoryEnum: SpaceCategoryNames;
	type: "Space";
	parentCategoryCode?: string;
}

export const spaceCategorySeedData: SpaceCategorySeedData[] = [
	{ spaceCategoryEnum: SpaceCategoryNames.ROOT, type: "Space" },
	{ spaceCategoryEnum: SpaceCategoryNames.BRANCH, type: "Space", parentCategoryCode: "ROOT" },
];

// ============================================================================
// Space Group 시드 데이터 (SpaceGroupNames enum 활용)
// ============================================================================

export interface SpaceGroupSeedData {
	spaceGroupEnum: SpaceGroupNames;
}

export const spaceGroupSeedData: SpaceGroupSeedData[] = [
	{ spaceGroupEnum: SpaceGroupNames.ROOT },
];

// ============================================================================
// Security Policy 시드 데이터
// ============================================================================

export interface SecurityPolicySeedData {
	key: string;
	passwordMinLength: number;
	passwordRequireUppercase: boolean;
	passwordRequireLowercase: boolean;
	passwordRequireNumber: boolean;
	passwordRequireSpecial: boolean;
	passwordExpirationDays: number;
	passwordReuseLimit: number;
	temporaryLockThreshold: number;
	temporaryLockDurationMin: number;
	permanentLockThreshold: number;
	accessTokenTtlSec: number;
	refreshTokenTtlSec: number;
	sessionTtlSec: number;
	ipWhitelistEnabled: boolean;
	emailDomainWhitelistEnabled: boolean;
	corsOriginWhitelistEnabled: boolean;
}

export const securityPolicySeedData: SecurityPolicySeedData = {
	key: "default",
	passwordMinLength: 8,
	passwordRequireUppercase: true,
	passwordRequireLowercase: true,
	passwordRequireNumber: true,
	passwordRequireSpecial: true,
	passwordExpirationDays: 0,
	passwordReuseLimit: 3,
	temporaryLockThreshold: 5,
	temporaryLockDurationMin: 15,
	permanentLockThreshold: 10,
	accessTokenTtlSec: 3600,
	refreshTokenTtlSec: 2592000,
	sessionTtlSec: 86400,
	ipWhitelistEnabled: false,
	emailDomainWhitelistEnabled: false,
	corsOriginWhitelistEnabled: false,
};

// ============================================================================
// Template 시드 데이터 (알림/메시지 템플릿)
// ============================================================================

/**
 * 템플릿 변수 시드 데이터 인터페이스
 */
export interface TemplateVariableSeedData {
	name: string;
	description?: string;
	defaultValue?: string;
	isRequired: boolean;
}

/**
 * 템플릿 시드 데이터 인터페이스
 */
export interface TemplateSeedData {
	code: string;
	name: string;
	type: "EMAIL" | "SMS" | "PUSH";
	subject?: string;
	content: string;
	description?: string;
	isActive: boolean;
	variables: TemplateVariableSeedData[];
}

/**
 * 템플릿 시드 데이터
 * 피트니스 서비스에서 사용하는 현실적인 알림 템플릿 (EMAIL 2개, SMS 2개, PUSH 2개)
 */
export const templateSeedData: TemplateSeedData[] = [
	// ---- EMAIL 템플릿 ----
	{
		code: "EMAIL_WELCOME",
		name: "회원 가입 환영",
		type: "EMAIL",
		subject: "{{groundName}}에 오신 것을 환영합니다!",
		content: `안녕하세요, {{userName}}님!\n\n{{groundName}}에 가입해 주셔서 감사합니다.\n\n첫 방문 시 프론트에서 본인 확인 후 이용 가능합니다.\n\n문의사항은 {{groundPhone}}으로 연락 주시기 바랍니다.\n\n감사합니다.\n{{groundName}} 드림`,
		description: "신규 회원 가입 시 발송하는 환영 이메일",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "groundName", description: "시설 이름", isRequired: true },
			{ name: "groundPhone", description: "시설 연락처", isRequired: true },
		],
	},
	{
		code: "EMAIL_RESERVATION_CONFIRM",
		name: "예약 확인",
		type: "EMAIL",
		subject: "[{{groundName}}] 예약이 확정되었습니다",
		content: `안녕하세요, {{userName}}님.\n\n아래 예약이 확정되었습니다.\n\n- 일시: {{reservationDate}} {{reservationTime}}\n- 프로그램: {{programName}}\n- 장소: {{groundName}}\n\n예약 변경/취소는 시작 2시간 전까지 가능합니다.\n\n감사합니다.`,
		description: "예약 확정 시 발송하는 확인 이메일",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "groundName", description: "시설 이름", isRequired: true },
			{ name: "reservationDate", description: "예약 날짜", isRequired: true },
			{ name: "reservationTime", description: "예약 시간", isRequired: true },
			{ name: "programName", description: "프로그램 이름", isRequired: true },
		],
	},
	// ---- SMS 템플릿 ----
	{
		code: "SMS_RESERVATION_REMINDER",
		name: "예약 리마인더",
		type: "SMS",
		content: "[{{groundName}}] {{userName}}님, 오늘 {{reservationTime}} {{programName}} 예약이 있습니다. 시작 10분 전까지 도착해 주세요.",
		description: "예약 당일 리마인더 SMS",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "groundName", description: "시설 이름", isRequired: true },
			{ name: "reservationTime", description: "예약 시간", isRequired: true },
			{ name: "programName", description: "프로그램 이름", isRequired: true },
		],
	},
	{
		code: "SMS_PAYMENT_COMPLETE",
		name: "결제 완료",
		type: "SMS",
		content: "[{{groundName}}] {{userName}}님, {{amount}}원 결제가 완료되었습니다. 이용권: {{membershipName}} ({{expiryDate}}까지)",
		description: "결제 완료 알림 SMS",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "groundName", description: "시설 이름", isRequired: true },
			{ name: "amount", description: "결제 금액", isRequired: true },
			{ name: "membershipName", description: "이용권 이름", isRequired: true },
			{ name: "expiryDate", description: "만료일", isRequired: true },
		],
	},
	// ---- PUSH 템플릿 ----
	{
		code: "PUSH_CLASS_START",
		name: "수업 시작 알림",
		type: "PUSH",
		subject: "수업이 곧 시작됩니다!",
		content: "{{userName}}님, {{programName}} 수업이 {{minutesBefore}}분 후 시작됩니다. {{groundName}}에서 만나요!",
		description: "수업 시작 전 푸시 알림",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "programName", description: "프로그램 이름", isRequired: true },
			{ name: "minutesBefore", description: "시작 전 분", defaultValue: "30", isRequired: false },
			{ name: "groundName", description: "시설 이름", isRequired: true },
		],
	},
	{
		code: "PUSH_MEMBERSHIP_EXPIRY",
		name: "이용권 만료 예정",
		type: "PUSH",
		subject: "이용권 만료 예정 안내",
		content: "{{userName}}님, {{membershipName}} 이용권이 {{daysLeft}}일 후 만료됩니다. 갱신 시 {{discountRate}} 할인 혜택을 받으실 수 있습니다.",
		description: "이용권 만료 예정 푸시 알림",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "membershipName", description: "이용권 이름", isRequired: true },
			{ name: "daysLeft", description: "남은 일수", isRequired: true },
			{ name: "discountRate", description: "할인율", defaultValue: "10%", isRequired: false },
		],
	},
];

// ============================================================================
// Translation 시드 데이터
// ============================================================================
export * from './translation-seed-data';
