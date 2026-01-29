/**
 * RequirementGraph에서 탭별 시각화 데이터를 추출하는 유틸리티
 */

import type {
	ApiMetadata,
	ApiView,
	ActionView,
	ComponentMetadata,
	ComponentType,
	ComponentView,
	EntityFieldMetadata,
	EntityFieldView,
	EntityView,
	FieldConstraint,
	FieldType,
	HttpMethod,
	RequirementEdge,
	RequirementGraph,
	RequirementNode,
	ScreenView,
} from "../components/requirements/types";

// ============================================================
// API 추출 (L6 노드)
// ============================================================

/**
 * 그래프에서 API 뷰 목록 추출
 */
export function extractApis(graph: RequirementGraph): ApiView[] {
	const apiNodes = graph.nodes.filter(
		(node) => node.type === "api" && node.level === 6,
	);

	return apiNodes.map((node) => {
		const metadata = (node.metadata as ApiMetadata) ?? {
			method: parseMethodFromName(node.name),
			endpoint: parseEndpointFromName(node.name),
		};

		// calls 엣지로 연결된 화면 찾기 (역방향: Screen → API)
		const calledByScreens = graph.edges
			.filter((edge) => edge.type === "calls" && edge.target === node.id)
			.map((edge) => edge.source);

		// stores 엣지로 연결된 Entity 찾기
		const usesEntities = graph.edges
			.filter((edge) => edge.type === "stores" && edge.source === node.id)
			.map((edge) => edge.target);

		return {
			id: node.id,
			name: node.name,
			description: node.description,
			method: metadata.method,
			endpoint: metadata.endpoint,
			metadata,
			calledByScreens,
			usesEntities,
		};
	});
}

/**
 * API 이름에서 HTTP 메서드 추출 (예: "GET /api/users" → "GET")
 */
function parseMethodFromName(name: string): HttpMethod {
	const methodMatch = name.match(/^(GET|POST|PUT|PATCH|DELETE)/);
	return (methodMatch?.[1] as HttpMethod) ?? "GET";
}

/**
 * API 이름에서 엔드포인트 추출 (예: "GET /api/users" → "/api/users")
 */
function parseEndpointFromName(name: string): string {
	const endpointMatch = name.match(/\s+(\/\S+)/);
	return endpointMatch?.[1] ?? name;
}

/**
 * 메서드별로 API 그룹화
 */
export function groupApisByMethod(
	apis: ApiView[],
): Record<HttpMethod, ApiView[]> {
	const groups: Record<HttpMethod, ApiView[]> = {
		GET: [],
		POST: [],
		PUT: [],
		PATCH: [],
		DELETE: [],
	};

	for (const api of apis) {
		groups[api.method].push(api);
	}

	return groups;
}

// ============================================================
// Entity 추출 (L7 노드)
// ============================================================

/**
 * 그래프에서 Entity 뷰 목록 추출
 */
export function extractEntities(graph: RequirementGraph): EntityView[] {
	// subLevel=1인 Entity 노드만 추출 (필드는 별도 처리)
	const entityNodes = graph.nodes.filter(
		(node) =>
			node.type === "entity" && node.level === 7 && node.subLevel === "1",
	);

	return entityNodes.map((node) => {
		// 필드 노드 찾기 (parent 엣지로 연결)
		const fieldIds = graph.edges
			.filter((edge) => edge.type === "parent" && edge.source === node.id)
			.map((edge) => edge.target);

		const fieldNodes = graph.nodes.filter(
			(n) => fieldIds.includes(n.id) && n.subLevel === "2",
		);

		const fields = fieldNodes.map((fieldNode) =>
			extractFieldView(fieldNode, graph),
		);

		// depends 엣지로 연결된 Entity 찾기 (이 Entity가 참조하는)
		const references = graph.edges
			.filter((edge) => edge.type === "depends" && edge.source === node.id)
			.map((edge) => edge.target);

		// depends 엣지로 연결된 Entity 찾기 (이 Entity를 참조하는)
		const referencedBy = graph.edges
			.filter((edge) => edge.type === "depends" && edge.target === node.id)
			.map((edge) => edge.source);

		// stores 엣지로 연결된 API 찾기 (역방향: API → Entity)
		const usedByApis = graph.edges
			.filter((edge) => edge.type === "stores" && edge.target === node.id)
			.map((edge) => edge.source);

		return {
			id: node.id,
			name: node.name,
			description: node.description,
			fields,
			references,
			referencedBy,
			usedByApis,
		};
	});
}

/**
 * 필드 노드에서 필드 뷰 추출
 */
function extractFieldView(
	node: RequirementNode,
	_graph: RequirementGraph,
): EntityFieldView {
	const metadata = node.metadata as EntityFieldMetadata | undefined;

	// 필드 이름 파싱 (예: "User.email" → "email")
	const fieldName = node.name.includes(".")
		? node.name.split(".")[1]
		: node.name;

	// 설명에서 타입 힌트 추출 (예: "이메일 주소 (unique)" → unique)
	const { fieldType, constraints } = parseFieldTypeFromDescription(
		node.description,
		metadata,
	);

	return {
		id: node.id,
		name: fieldName,
		description: node.description,
		fieldType,
		constraints,
		defaultValue: metadata?.defaultValue,
		references: metadata?.references,
	};
}

/**
 * 필드 설명에서 타입과 제약조건 추출
 */
function parseFieldTypeFromDescription(
	description: string,
	metadata?: EntityFieldMetadata,
): { fieldType: FieldType; constraints: FieldConstraint[] } {
	if (metadata?.fieldType) {
		return {
			fieldType: metadata.fieldType,
			constraints: metadata.constraints ?? [],
		};
	}

	const constraints: FieldConstraint[] = [];
	let fieldType: FieldType = "String";

	// 설명에서 힌트 추출
	const lowerDesc = description.toLowerCase();

	if (lowerDesc.includes("uuid") || lowerDesc.includes("pk")) {
		fieldType = "UUID";
		if (lowerDesc.includes("pk") || lowerDesc.includes("고유")) {
			constraints.push("pk");
		}
	} else if (lowerDesc.includes("datetime") || lowerDesc.includes("일시")) {
		fieldType = "DateTime";
	} else if (
		lowerDesc.includes("enum") ||
		lowerDesc.includes("상태") ||
		lowerDesc.includes("역할")
	) {
		fieldType = "Enum";
	} else if (lowerDesc.includes("fk") || lowerDesc.includes("참조")) {
		fieldType = "String";
		constraints.push("fk");
	}

	if (lowerDesc.includes("unique") || lowerDesc.includes("고유")) {
		if (!constraints.includes("pk")) {
			constraints.push("unique");
		}
	}

	if (lowerDesc.includes("required") || lowerDesc.includes("필수")) {
		constraints.push("required");
	}

	return { fieldType, constraints };
}

/**
 * Mermaid ERD 다이어그램 생성
 */
export function generateMermaidERD(entities: EntityView[]): string {
	const lines: string[] = ["erDiagram"];

	for (const entity of entities) {
		// Entity 정의
		lines.push(`    ${entity.name} {`);
		for (const field of entity.fields) {
			const pkMark = field.constraints.includes("pk") ? "PK" : "";
			const fkMark = field.constraints.includes("fk") ? "FK" : "";
			const mark = pkMark || fkMark;
			lines.push(
				`        ${field.fieldType} ${field.name}${mark ? ` "${mark}"` : ""}`,
			);
		}
		lines.push("    }");
	}

	// 관계 추가
	for (const entity of entities) {
		for (const refId of entity.references) {
			const refEntity = entities.find((e) => e.id === refId);
			if (refEntity) {
				lines.push(`    ${entity.name} }o--|| ${refEntity.name} : references`);
			}
		}
	}

	return lines.join("\n");
}

// ============================================================
// Screen 추출 (L4 노드)
// ============================================================

/**
 * 그래프에서 Screen 뷰 목록 추출
 */
export function extractScreens(graph: RequirementGraph): ScreenView[] {
	const screenNodes = graph.nodes.filter(
		(node) => node.type === "screen" && node.level === 4,
	);

	return screenNodes.map((node) => {
		// uses 엣지로 연결된 컴포넌트 찾기
		const componentIds = graph.edges
			.filter((edge) => edge.type === "uses" && edge.source === node.id)
			.map((edge) => edge.target);

		const componentNodes = graph.nodes.filter((n) =>
			componentIds.includes(n.id),
		);
		const components = componentNodes.map((cNode) =>
			extractComponentView(cNode),
		);

		// parent 엣지로 연결된 액션 찾기
		const actionIds = graph.edges
			.filter((edge) => edge.type === "parent" && edge.source === node.id)
			.map((edge) => edge.target);

		const actionNodes = graph.nodes.filter(
			(n) => actionIds.includes(n.id) && n.type === "action",
		);
		const actions = actionNodes.map((aNode) => extractActionView(aNode));

		// calls 엣지로 연결된 API 찾기
		const apis = graph.edges
			.filter((edge) => edge.type === "calls" && edge.source === node.id)
			.map((edge) => edge.target);

		return {
			id: node.id,
			name: node.name,
			description: node.description,
			path: node.path,
			components,
			actions,
			apis,
		};
	});
}

/**
 * 컴포넌트 노드에서 컴포넌트 뷰 추출
 */
function extractComponentView(node: RequirementNode): ComponentView {
	const metadata = node.metadata as ComponentMetadata | undefined;

	return {
		id: node.id,
		name: node.name,
		description: node.description,
		componentType: metadata?.componentType ?? guessComponentType(node.name),
		existing: metadata?.existing ?? false,
		props: metadata?.props,
	};
}

/**
 * 컴포넌트 이름에서 타입 추측
 */
function guessComponentType(name: string): ComponentType {
	const lowerName = name.toLowerCase();

	if (lowerName.includes("input") || lowerName.includes("picker")) {
		return "inputs";
	}
	if (
		lowerName.includes("table") ||
		lowerName.includes("card") ||
		lowerName.includes("calendar")
	) {
		return "widgets";
	}
	if (lowerName.includes("nav") || lowerName.includes("menu")) {
		return "features";
	}
	if (lowerName.includes("layout") || lowerName.includes("surface")) {
		return "layouts";
	}

	return "ui";
}

/**
 * 액션 노드에서 액션 뷰 추출
 */
function extractActionView(node: RequirementNode): ActionView {
	return {
		id: node.id,
		name: node.name,
		description: node.description,
		subLevel: node.subLevel ?? "1",
	};
}

// ============================================================
// 노드 조회 헬퍼
// ============================================================

/**
 * ID로 노드 찾기
 */
export function findNodeById(
	graph: RequirementGraph,
	id: string,
): RequirementNode | undefined {
	return graph.nodes.find((node) => node.id === id);
}

/**
 * ID 목록으로 노드 이름 목록 가져오기
 */
export function getNodeNames(
	graph: RequirementGraph,
	ids: string[],
): string[] {
	return ids
		.map((id) => findNodeById(graph, id)?.name)
		.filter((name): name is string => name !== undefined);
}
