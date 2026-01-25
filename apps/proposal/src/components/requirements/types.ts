/**
 * 요구사항 그래프 타입 정의
 *
 * 요구사항 계층 구조 (L0 ~ L10):
 * - L0: 시스템 컨텍스트
 * - L1: 사용자 (Actor)
 * - L2: 사용자 목표 (Goal)
 * - L3: 기능 (Feature)
 * - L4: 화면 (Screen)
 * - L5: 인터랙션 (Action) - L5.1 사용자 액션, L5.2 시스템 반응, L5.3 상태 전이
 * - L6: API - L6.1 엔드포인트, L6.2 요청, L6.3 응답, L6.4 에러
 * - L7: 데이터 모델 - L7.1 엔티티, L7.2 필드, L7.3 관계, L7.4 제약조건
 * - L8: UI 컴포넌트 - L8.1 레이아웃, L8.2 목록, L8.3 상태별 UI, L8.4 Props
 * - L9: 비즈니스 로직 - L9.1 유효성, L9.2 권한, L9.3 계산, L9.4 엣지케이스
 * - L10: 테스트 - L10.1 Happy, L10.2 Error, L10.3 Edge
 */

/**
 * 노드 타입
 */
export type NodeType =
	| "context" // L0: 시스템 컨텍스트
	| "actor" // L1: 사용자
	| "goal" // L2: 사용자 목표
	| "feature" // L3: 기능
	| "screen" // L4: 화면
	| "action" // L5: 인터랙션
	| "api" // L6: API
	| "entity" // L7: 데이터 모델
	| "component" // L8: UI 컴포넌트
	| "logic" // L9: 비즈니스 로직
	| "test"; // L10: 테스트

/**
 * 엣지 타입 (관계 유형)
 */
export type EdgeType =
	| "parent" // 계층 관계
	| "implements" // Feature ← Screen
	| "calls" // Screen → API
	| "uses" // Screen → Component
	| "stores" // API → Entity
	| "validates" // Logic → Field
	| "tests" // Test → Feature
	| "depends"; // 의존 관계

/**
 * 요구사항 노드
 */
export interface RequirementNode {
	/** 고유 ID (예: "L4-SCR-001") */
	id: string;
	/** 레벨 (0~10) */
	level: number;
	/** 서브 레벨 (예: L5.1의 "1") */
	subLevel?: string;
	/** 노드 타입 */
	type: NodeType;
	/** 노드 이름 */
	name: string;
	/** 상세 설명 */
	description: string;
	/** 경로 (화면인 경우) */
	path?: string;
	/** 추가 메타데이터 */
	metadata?: Record<string, unknown>;
}

/**
 * 요구사항 엣지 (관계)
 */
export interface RequirementEdge {
	/** 고유 ID */
	id: string;
	/** 소스 노드 ID */
	source: string;
	/** 타겟 노드 ID */
	target: string;
	/** 엣지 타입 */
	type: EdgeType;
	/** 관계 설명 (옵션) */
	label?: string;
}

/**
 * 요구사항 그래프
 */
export interface RequirementGraph {
	/** 그래프 ID */
	id: string;
	/** 프로젝트 이름 */
	name: string;
	/** 버전 */
	version: string;
	/** 노드 목록 */
	nodes: RequirementNode[];
	/** 엣지 목록 */
	edges: RequirementEdge[];
	/** 메타데이터 */
	metadata: {
		createdAt: string;
		updatedAt: string;
	};
}

/**
 * 필터 상태
 */
export interface GraphFilterState {
	/** 선택된 레벨 범위 (0~10) */
	selectedLevels: number[];
	/** 선택된 노드 타입 */
	selectedTypes: NodeType[];
	/** 검색어 */
	searchQuery: string;
}

/**
 * 노드 스타일 설정 (레벨/타입별)
 */
export interface NodeStyleConfig {
	/** 배경색 */
	fill: string;
	/** 테두리색 */
	stroke: string;
	/** 아이콘 */
	icon?: string;
	/** 크기 */
	size: number;
}

/**
 * AI 질의 메시지
 */
export interface AIMessage {
	/** 역할 */
	role: "user" | "assistant";
	/** 메시지 내용 */
	content: string;
	/** 타임스탬프 */
	timestamp: Date;
}

/**
 * 노드 타입별 색상 설정
 */
export const NODE_TYPE_COLORS: Record<NodeType, NodeStyleConfig> = {
	context: { fill: "#374151", stroke: "#6B7280", size: 60 },
	actor: { fill: "#1E40AF", stroke: "#3B82F6", size: 50 },
	goal: { fill: "#7C3AED", stroke: "#A78BFA", size: 48 },
	feature: { fill: "#059669", stroke: "#34D399", size: 46 },
	screen: { fill: "#D97706", stroke: "#FBBF24", size: 44 },
	action: { fill: "#DC2626", stroke: "#F87171", size: 40 },
	api: { fill: "#2563EB", stroke: "#60A5FA", size: 42 },
	entity: { fill: "#7C3AED", stroke: "#A78BFA", size: 42 },
	component: { fill: "#EC4899", stroke: "#F472B6", size: 40 },
	logic: { fill: "#0891B2", stroke: "#22D3EE", size: 38 },
	test: { fill: "#16A34A", stroke: "#4ADE80", size: 36 },
};

/**
 * 엣지 타입별 색상 설정
 */
export const EDGE_TYPE_COLORS: Record<EdgeType, string> = {
	parent: "#6B7280",
	implements: "#34D399",
	calls: "#60A5FA",
	uses: "#F472B6",
	stores: "#A78BFA",
	validates: "#22D3EE",
	tests: "#4ADE80",
	depends: "#F87171",
};

/**
 * 레벨별 그룹 정의
 */
export const LEVEL_GROUPS = [
	{ label: "컨텍스트 (L0~L2)", levels: [0, 1, 2] },
	{ label: "기능/화면 (L3~L4)", levels: [3, 4] },
	{ label: "인터랙션/API (L5~L6)", levels: [5, 6] },
	{ label: "데이터/컴포넌트 (L7~L8)", levels: [7, 8] },
	{ label: "로직/테스트 (L9~L10)", levels: [9, 10] },
];

/**
 * 노드 타입 한글 라벨
 */
export const NODE_TYPE_LABELS: Record<NodeType, string> = {
	context: "시스템 컨텍스트",
	actor: "사용자",
	goal: "목표",
	feature: "기능",
	screen: "화면",
	action: "인터랙션",
	api: "API",
	entity: "엔티티",
	component: "컴포넌트",
	logic: "비즈니스 로직",
	test: "테스트",
};

/**
 * 엣지 타입 한글 라벨
 */
export const EDGE_TYPE_LABELS: Record<EdgeType, string> = {
	parent: "상위",
	implements: "구현",
	calls: "호출",
	uses: "사용",
	stores: "저장",
	validates: "검증",
	tests: "테스트",
	depends: "의존",
};
