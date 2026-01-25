import type { RequirementGraph } from "../components/requirements/types";

/**
 * 그래프 데이터를 AI 질의용 컨텍스트 문자열로 변환
 */
export function buildGraphContext(graph: RequirementGraph): string {
	const lines: string[] = [];

	lines.push(`# 프로젝트: ${graph.name}`);
	lines.push(`버전: ${graph.version}`);
	lines.push("");

	// 노드 정보
	lines.push("## 노드 목록");
	lines.push("");

	// 레벨별로 그룹화
	const nodesByLevel = graph.nodes.reduce(
		(acc, node) => {
			const level = node.level;
			if (!acc[level]) acc[level] = [];
			acc[level].push(node);
			return acc;
		},
		{} as Record<number, typeof graph.nodes>,
	);

	for (const level of Object.keys(nodesByLevel)
		.map(Number)
		.sort((a, b) => a - b)) {
		const nodes = nodesByLevel[level];
		lines.push(`### Level ${level}`);

		for (const node of nodes) {
			lines.push(`- **${node.id}** (${node.type}): ${node.name}`);
			lines.push(`  설명: ${node.description}`);
			if (node.path) {
				lines.push(`  경로: ${node.path}`);
			}
			if (node.metadata) {
				lines.push(`  메타데이터: ${JSON.stringify(node.metadata)}`);
			}
		}
		lines.push("");
	}

	// 엣지 정보
	lines.push("## 관계 목록");
	lines.push("");

	// 타입별로 그룹화
	const edgesByType = graph.edges.reduce(
		(acc, edge) => {
			const type = edge.type;
			if (!acc[type]) acc[type] = [];
			acc[type].push(edge);
			return acc;
		},
		{} as Record<string, typeof graph.edges>,
	);

	for (const type of Object.keys(edgesByType)) {
		const edges = edgesByType[type];
		lines.push(`### ${type} 관계`);

		for (const edge of edges) {
			const sourceNode = graph.nodes.find((n) => n.id === edge.source);
			const targetNode = graph.nodes.find((n) => n.id === edge.target);
			lines.push(
				`- ${sourceNode?.name || edge.source} → ${targetNode?.name || edge.target}${edge.label ? ` (${edge.label})` : ""}`,
			);
		}
		lines.push("");
	}

	return lines.join("\n");
}

/**
 * AI 질의를 위한 시스템 프롬프트 생성
 */
export function buildSystemPrompt(graphContext: string): string {
	return `당신은 소프트웨어 요구사항 분석 전문가입니다.
아래 그래프 데이터를 기반으로 사용자의 질문에 답변해주세요.

## 그래프 구조 설명
- Level 0-2: 시스템 컨텍스트, 액터, 목표 (상위 개념)
- Level 3-4: 기능, 화면 (구현 단위)
- Level 5-6: 인터랙션, API (상세 동작)
- Level 7-8: 데이터 모델, UI 컴포넌트 (구현 세부사항)
- Level 9-10: 비즈니스 로직, 테스트 (검증)

## 관계 타입
- parent: 계층적 포함 관계
- implements: 기능을 화면이 구현
- calls: 화면이 API를 호출
- uses: 화면이 컴포넌트를 사용
- stores: API가 엔티티를 저장/조회
- validates: 로직이 필드를 검증
- tests: 테스트가 기능을 검증
- depends: 일반적인 의존 관계

## 그래프 데이터
${graphContext}

## 응답 지침
1. 한국어로 답변하세요
2. 그래프 데이터에 기반하여 정확하게 답변하세요
3. 관련 노드 ID와 이름을 함께 언급하세요
4. 영향도 분석 시 관계를 따라 추적하세요
5. 간결하고 명확하게 답변하세요`;
}

/**
 * Claude API를 통한 그래프 질의
 */
export async function queryGraphWithAI(
	question: string,
	graph: RequirementGraph,
): Promise<string> {
	const graphContext = buildGraphContext(graph);
	const systemPrompt = buildSystemPrompt(graphContext);

	const response = await fetch("/api/requirements/ai", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			question,
			systemPrompt,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		const errorMessage = data.error || response.statusText;
		const details = data.details ? `\n상세: ${data.details}` : "";
		throw new Error(`API 요청 실패: ${errorMessage}${details}`);
	}

	return data.answer;
}
