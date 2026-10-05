import {
	adminMenuSubjectSeedData,
	adminPageSubjectSeedData,
} from "./admin-permissions";

/**
 * Action 설정 타입 (config JSON 필드)
 *
 * 마스킹/포맷팅 같은 후처리 규칙도 Action 자체의 정의에 포함시켜,
 * ability가 action 이름만 참조해도 의미가 보존되도록 합니다.
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
		config: null,
	},
	{
		name: "read",
		displayName: "조회",
		description: "리소스를 조회합니다",
		group: "crud",
		order: 1,
		config: null,
	},
	{
		name: "update",
		displayName: "수정",
		description: "리소스를 수정합니다",
		group: "crud",
		order: 2,
		config: null,
	},
	{
		name: "delete",
		displayName: "삭제",
		description: "리소스를 삭제합니다",
		group: "crud",
		order: 3,
		config: null,
	},
	{
		name: "manage",
		displayName: "전체 관리",
		description: "모든 권한을 가집니다",
		group: "crud",
		order: 4,
		config: null,
	},

	// ---- Visibility 액션 ----
	{
		name: "read:full",
		displayName: "전체 조회",
		description: "마스킹 없이 전체 데이터를 조회합니다",
		group: "visibility",
		order: 10,
		config: null,
	},
	{
		name: "read:hidden",
		displayName: "숨김",
		description: "데이터를 숨깁니다",
		group: "visibility",
		order: 11,
		config: null,
	},
	{
		name: "read:masked:email",
		displayName: "이메일 마스킹 조회",
		description: "이메일을 마스킹하여 조회합니다 (예: u***@domain.com)",
		group: "visibility",
		order: 12,
		config: { type: "masking", preset: "PRESET_EMAIL" },
	},
	{
		name: "read:masked:phone",
		displayName: "전화번호 마스킹 조회",
		description: "전화번호를 마스킹하여 조회합니다 (예: 010-****-5678)",
		group: "visibility",
		order: 13,
		config: { type: "masking", preset: "PRESET_PHONE" },
	},
	{
		name: "read:masked:name",
		displayName: "이름 마스킹 조회",
		description: "이름을 마스킹하여 조회합니다 (예: 홍*동)",
		group: "visibility",
		order: 14,
		config: { type: "masking", preset: "PRESET_NAME" },
	},
	{
		name: "read:masked:ssn",
		displayName: "주민번호 마스킹 조회",
		description: "주민번호를 마스킹하여 조회합니다 (예: 920315-*******)",
		group: "visibility",
		order: 15,
		config: { type: "masking", preset: "PRESET_SSN" },
	},
	{
		name: "read:masked:card",
		displayName: "카드번호 마스킹 조회",
		description: "카드번호를 마스킹하여 조회합니다 (예: 1234-****-****-3456)",
		group: "visibility",
		order: 16,
		config: { type: "masking", preset: "PRESET_CARD" },
	},
	{
		name: "read:masked:account",
		displayName: "계좌번호 마스킹 조회",
		description: "계좌번호를 마스킹하여 조회합니다",
		group: "visibility",
		order: 17,
		config: { type: "masking", preset: "PRESET_ACCOUNT" },
	},

	// ---- Bulk 액션 ----
	{
		name: "export",
		displayName: "내보내기",
		description: "데이터를 내보냅니다",
		group: "bulk",
		order: 20,
		config: null,
	},
	{
		name: "import",
		displayName: "가져오기",
		description: "데이터를 가져옵니다",
		group: "bulk",
		order: 21,
		config: null,
	},

	// ---- Workflow 액션 ----
	{
		name: "access",
		displayName: "접근",
		description: "리소스에 접근합니다",
		group: "workflow",
		order: 30,
		config: null,
	},
	{
		name: "approve",
		displayName: "승인",
		description: "리소스를 승인합니다",
		group: "workflow",
		order: 31,
		config: null,
	},
	{
		name: "reject",
		displayName: "반려",
		description: "리소스를 반려합니다",
		group: "workflow",
		order: 32,
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
	group: "all" | "entity" | "menu" | "page" | "feature" | "ui"; // 그룹핑
	order?: number; // UI 정렬 순서
}

/**
 * Subject 시드 데이터
 * - Prisma 모델 기반 Subject는 DMMF에서 자동 동기화됨
 * - 이 배열은 커스텀 Subject만 정의 (메뉴, 기능 등)
 *
 * 즉, 여기의 역할은 "DB 모델 외부의 권한 대상"을 보충하는 것입니다.
 *
 * Admin menu/page subject는 frontend shared catalog에서 파생하며,
 * 이 배열은 non-admin custom subject만 유지합니다.
 */
const staticSubjectSeedData: SubjectSeedData[] = [
	// ---- 전체 ----
	{ name: "all", displayName: "전체", group: "all", order: 0 },

	// ---- 엔티티 (Prisma 모델 기반) ----
	// DMMF에서 자동 동기화되므로 여기서는 entity: 접두사가 붙은 것들만 정의
	{ name: "entity:User", displayName: "사용자", group: "entity", order: 1 },
	{
		name: "entity:FitnessCenter",
		displayName: "피트니스센터",
		group: "entity",
		order: 2,
	},
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

	// Admin menu/page subjects are seeded only from the shared frontend catalog.

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

const derivedAdminSubjectNames = new Set(
	[...adminMenuSubjectSeedData, ...adminPageSubjectSeedData].map(
		(subject) => subject.name,
	),
);

export const subjectSeedData: SubjectSeedData[] = [
	...staticSubjectSeedData.filter(
		(subject) => !derivedAdminSubjectNames.has(subject.name),
	),
	...adminMenuSubjectSeedData,
	...adminPageSubjectSeedData,
];
