/**
 * 기획 문서 파서
 * SOT: 기획 문서(README.md + 세부 문서)에서 정보를 추출
 */

import type {
	ParsedFeature,
	ParsedPlan,
	ParsedScreen,
	ParsedTask,
	StageInfo,
} from "../../types/wbs";

/**
 * 5단계 플로우 상태 파싱
 * README.md에서 Stage 1~5 상태를 추출
 */
export function parseStages(content: string): StageInfo[] {
	const stages: StageInfo[] = [
		{
			stage: 1,
			name: "데이터 설계",
			description: "기획서 + 설계서 작성",
			status: "pending",
			subTasks: ["요구사항 분석", "데이터 모델 설계", "API 설계"],
		},
		{
			stage: 2,
			name: "스키마 구현",
			description: "Prisma, Entity, DTO",
			status: "pending",
			subTasks: ["Prisma 스키마 작성", "Entity 클래스 생성", "DTO 클래스 생성"],
		},
		{
			stage: 3,
			name: "백엔드 로직",
			description: "Repository, Service, Controller",
			status: "pending",
			subTasks: [
				"Repository 구현",
				"Service 비즈니스 로직",
				"Controller API 엔드포인트",
			],
		},
		{
			stage: 4,
			name: "컴포넌트 구현",
			description: "UI, Widget, Feature",
			status: "pending",
			subTasks: ["Pure UI 컴포넌트", "Widget 조합", "Feature 비즈니스 연결"],
		},
		{
			stage: 5,
			name: "페이지 통합",
			description: "Page, Route",
			status: "pending",
			subTasks: ["페이지 컴포넌트", "라우팅 설정", "통합 테스트"],
		},
	];

	// Stage 상태 파싱 (✅ 완료, ⏳ 대기, 🔄 진행중)
	const stagePatterns = [
		/Stage\s*1[^✅⏳🔄]*([✅⏳🔄])/u,
		/Stage\s*2[^✅⏳🔄]*([✅⏳🔄])/u,
		/Stage\s*3[^✅⏳🔄]*([✅⏳🔄])/u,
		/Stage\s*4[^✅⏳🔄]*([✅⏳🔄])/u,
		/Stage\s*5[^✅⏳🔄]*([✅⏳🔄])/u,
	];

	for (let i = 0; i < stagePatterns.length; i++) {
		const match = content.match(stagePatterns[i]);
		if (match) {
			const statusEmoji = match[1];
			if (statusEmoji === "✅") {
				stages[i].status = "completed";
			} else if (statusEmoji === "🔄") {
				stages[i].status = "in_progress";
			}
			// ⏳는 기본값(pending)
		}
	}

	// 진행 상황 섹션에서 체크박스 파싱
	const progressMatch = content.match(/## 진행 상황[\s\S]*?(?=##|$)/i);
	if (progressMatch) {
		const progressContent = progressMatch[0];

		// [x] 완료된 항목 확인
		if (/\[x\].*기획서.*완료/i.test(progressContent)) {
			stages[0].status = "completed";
		}
		if (/\[x\].*스키마.*완료/i.test(progressContent)) {
			stages[1].status = "completed";
		}
		if (/\[x\].*백엔드.*완료/i.test(progressContent)) {
			stages[2].status = "completed";
		}
		if (/\[x\].*컴포넌트.*완료/i.test(progressContent)) {
			stages[3].status = "completed";
		}
		if (/\[x\].*페이지.*완료/i.test(progressContent)) {
			stages[4].status = "completed";
		}
	}

	return stages;
}

/**
 * 핵심 기능 목록 파싱
 * "핵심 기능" 또는 "주요 기능" 테이블에서 추출
 */
export function parseFeatures(content: string): ParsedFeature[] {
	const features: ParsedFeature[] = [];

	// 테이블 형식: | 기능 | 설명 |
	const tableMatch = content.match(
		/###?\s*핵심 기능[\s\S]*?\|.*\|.*\|[\s\S]*?(?=\n\n|###|$)/i,
	);

	if (tableMatch) {
		const tableContent = tableMatch[0];
		const rows = tableContent.split("\n").filter((line) => {
			// 테이블 행만 추출 (헤더, 구분선 제외)
			return (
				line.startsWith("|") &&
				!line.includes("---") &&
				!line.includes("기능") &&
				!line.includes("설명")
			);
		});

		for (const row of rows) {
			const cells = row
				.split("|")
				.map((cell) => cell.trim())
				.filter(Boolean);
			if (cells.length >= 2) {
				features.push({
					name: cells[0],
					description: cells[1],
				});
			}
		}
	}

	return features;
}

/**
 * 화면 목록 파싱
 * "CRUD 화면 구성" 또는 "화면 목록" 테이블에서 추출
 */
export function parseScreens(content: string): ParsedScreen[] {
	const screens: ParsedScreen[] = [];

	// CRUD 화면 구성 테이블
	const crudMatch = content.match(
		/###?\s*CRUD 화면 구성[\s\S]*?\|.*\|.*\|[\s\S]*?(?=\n\n|###|$)/i,
	);

	if (crudMatch) {
		const tableContent = crudMatch[0];
		const rows = tableContent.split("\n").filter((line) => {
			return (
				line.startsWith("|") &&
				!line.includes("---") &&
				!line.includes("기능") &&
				!line.includes("화면")
			);
		});

		for (const row of rows) {
			const cells = row
				.split("|")
				.map((cell) => cell.trim())
				.filter(Boolean);
			if (cells.length >= 3) {
				const type = inferScreenType(cells[0]);
				screens.push({
					name: cells[1],
					path: cells[2],
					type,
				});
			}
		}
	}

	// 라우팅 경로 테이블
	const routeMatch = content.match(
		/###?\s*라우팅 경로[\s\S]*?\|.*\|.*\|[\s\S]*?(?=\n\n|###|$)/i,
	);

	if (routeMatch) {
		const tableContent = routeMatch[0];
		const rows = tableContent.split("\n").filter((line) => {
			return (
				line.startsWith("|") &&
				!line.includes("---") &&
				!line.includes("탭") &&
				!line.includes("경로")
			);
		});

		for (const row of rows) {
			const cells = row
				.split("|")
				.map((cell) => cell.trim())
				.filter(Boolean);
			if (cells.length >= 2) {
				// 중복 방지
				const path = cells[1];
				if (!screens.some((s) => s.path === path)) {
					screens.push({
						name: cells[0],
						path: cells[1],
						type: "list",
					});
				}
			}
		}
	}

	return screens;
}

function inferScreenType(
	typeStr: string,
): "list" | "detail" | "create" | "edit" | "modal" | "other" {
	const normalized = typeStr.toLowerCase();
	if (normalized.includes("목록") || normalized.includes("list")) return "list";
	if (normalized.includes("상세") || normalized.includes("detail"))
		return "detail";
	if (
		normalized.includes("등록") ||
		normalized.includes("create") ||
		normalized.includes("new")
	)
		return "create";
	if (normalized.includes("수정") || normalized.includes("edit")) return "edit";
	if (normalized.includes("삭제") || normalized.includes("모달"))
		return "modal";
	return "other";
}

/**
 * 구현 우선순위 태스크 파싱
 * "백엔드" / "프론트엔드" 섹션에서 순서 있는 작업 목록 추출
 */
export function parseTasks(
	content: string,
	section: "backend" | "frontend",
): ParsedTask[] {
	const tasks: ParsedTask[] = [];

	const sectionKeyword = section === "backend" ? "백엔드" : "프론트엔드";
	const sectionRegex = new RegExp(
		`###?\\s*${sectionKeyword}[^#]*?\\|.*순서.*\\|[\\s\\S]*?(?=###|$)`,
		"i",
	);

	const sectionMatch = content.match(sectionRegex);

	if (sectionMatch) {
		const sectionContent = sectionMatch[0];
		const rows = sectionContent.split("\n").filter((line) => {
			return (
				line.startsWith("|") &&
				!line.includes("---") &&
				!line.includes("순서") &&
				!line.includes("작업")
			);
		});

		for (const row of rows) {
			const cells = row
				.split("|")
				.map((cell) => cell.trim())
				.filter(Boolean);
			if (cells.length >= 2) {
				const orderMatch = cells[0].match(/(\d+)/);
				const order = orderMatch ? Number.parseInt(orderMatch[1], 10) : 0;
				tasks.push({
					order,
					name: cells[1],
					description: cells[2] || undefined,
				});
			}
		}
	}

	return tasks;
}

/**
 * 제목 파싱 (첫 번째 # 헤더)
 */
export function parseTitle(content: string): string {
	const match = content.match(/^#\s+(.+)$/m);
	return match ? match[1].trim() : "Untitled";
}

/**
 * 메타데이터 파싱 (작성일, 플랫폼 등)
 */
export function parseMetadata(content: string): {
	platform?: string;
	createdAt?: string;
	updatedAt?: string;
} {
	const metadata: {
		platform?: string;
		createdAt?: string;
		updatedAt?: string;
	} = {};

	const platformMatch = content.match(/\*\*플랫폼:\*\*\s*(.+)/);
	if (platformMatch) {
		metadata.platform = platformMatch[1].trim();
	}

	const createdMatch = content.match(/\*\*작성일:\*\*\s*(.+)/);
	if (createdMatch) {
		metadata.createdAt = createdMatch[1].trim();
	}

	const updatedMatch = content.match(/\*\*수정일:\*\*\s*(.+)/);
	if (updatedMatch) {
		metadata.updatedAt = updatedMatch[1].trim();
	}

	return metadata;
}

/**
 * 전체 기획 문서 파싱
 */
export function parsePlanDocument(
	folderId: string,
	readmeContent: string,
): ParsedPlan {
	const title = parseTitle(readmeContent);
	const metadata = parseMetadata(readmeContent);
	const stages = parseStages(readmeContent);
	const features = parseFeatures(readmeContent);
	const screens = parseScreens(readmeContent);
	const backendTasks = parseTasks(readmeContent, "backend");
	const frontendTasks = parseTasks(readmeContent, "frontend");

	return {
		id: folderId,
		name: title,
		...metadata,
		stages,
		features,
		screens,
		backendTasks,
		frontendTasks,
	};
}
