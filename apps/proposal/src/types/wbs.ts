/**
 * WBS (Work Breakdown Structure) 타입 정의
 * SOT: 기획 문서에서 WBS를 자동 생성하기 위한 타입들
 */

/**
 * WBS 태스크
 */
export interface WbsTask {
	id: string;
	name: string;
	start: string; // YYYY-MM-DD
	end: string; // YYYY-MM-DD
	progress: number; // 0-100
	dependencies?: string[];
	parentId?: string;
	isGroup?: boolean;
}

/**
 * WBS 전체 데이터
 */
export interface WbsData {
	id: string;
	name: string;
	description: string;
	startDate: string;
	tasks: WbsTask[];
	metadata: {
		createdAt: string;
		updatedAt: string;
		sourceType: "plan" | "manual";
		sourcePath?: string; // 기획 문서 경로 (plan 타입인 경우)
	};
}

/**
 * 5단계 개발 플로우 단계
 */
export type StageNumber = 1 | 2 | 3 | 4 | 5;

export interface StageInfo {
	stage: StageNumber;
	name: string;
	description: string;
	status: "completed" | "in_progress" | "pending";
	subTasks: string[];
}

/**
 * 기획 문서 파싱 결과
 */
export interface ParsedPlan {
	id: string; // 폴더명 (예: 2026-01-01-AdminAuthenticationSystem)
	name: string; // 제목 (예: 관리자 인증 시스템)
	platform?: string;
	createdAt?: string;
	updatedAt?: string;

	// 5단계 플로우 상태
	stages: StageInfo[];

	// 핵심 기능 목록
	features: ParsedFeature[];

	// 화면 목록
	screens: ParsedScreen[];

	// 구현 우선순위 (백엔드/프론트엔드)
	backendTasks: ParsedTask[];
	frontendTasks: ParsedTask[];
}

export interface ParsedFeature {
	name: string;
	description: string;
}

export interface ParsedScreen {
	name: string;
	path: string;
	type: "list" | "detail" | "create" | "edit" | "modal" | "other";
}

export interface ParsedTask {
	order: number;
	name: string;
	description?: string;
}

/**
 * WBS 생성 옵션
 */
export interface WbsGenerationOptions {
	startDate: string; // 프로젝트 시작일
	workingDaysPerWeek?: number; // 주당 작업일 (기본: 5)
	hoursPerDay?: number; // 일당 작업시간 (기본: 8)

	// 각 단계별 예상 소요일
	stageDurations?: {
		stage1?: number; // 데이터 설계 (기본: 3일)
		stage2?: number; // 스키마 구현 (기본: 2일)
		stage3?: number; // 백엔드 로직 (기본: 5일)
		stage4?: number; // 컴포넌트 구현 (기본: 5일)
		stage5?: number; // 페이지 통합 (기본: 3일)
	};

	// 테스트/QA 기간 포함 여부
	includeTestingPhase?: boolean;
	testingDuration?: number; // 기본: 3일
}

/**
 * 기획 폴더 목록 응답
 */
export interface PlanFolder {
	id: string;
	name: string;
	path: string;
	hasReadme: boolean;
	documentCount: number;
	lastModified: string;
}
