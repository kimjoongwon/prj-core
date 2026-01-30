/**
 * WBS 자동 생성기
 * SOT: ParsedPlan에서 WBS 데이터를 생성
 */

import type {
	ParsedPlan,
	WbsData,
	WbsGenerationOptions,
	WbsTask,
} from "../../types/wbs";

/**
 * 완전히 채워진 stageDurations 타입
 */
interface RequiredStageDurations {
	stage1: number;
	stage2: number;
	stage3: number;
	stage4: number;
	stage5: number;
}

/**
 * 기본 생성 옵션
 */
const DEFAULT_STAGE_DURATIONS: RequiredStageDurations = {
	stage1: 3,
	stage2: 2,
	stage3: 5,
	stage4: 5,
	stage5: 3,
};

const DEFAULT_OPTIONS = {
	startDate: new Date().toISOString().split("T")[0],
	workingDaysPerWeek: 5,
	hoursPerDay: 8,
	stageDurations: DEFAULT_STAGE_DURATIONS,
	includeTestingPhase: true,
	testingDuration: 3,
};

/**
 * 날짜에 근무일 추가 (주말 제외)
 */
function addWorkingDays(startDate: Date, days: number): Date {
	const result = new Date(startDate);
	let addedDays = 0;

	while (addedDays < days) {
		result.setDate(result.getDate() + 1);
		const dayOfWeek = result.getDay();
		// 토(6), 일(0) 제외
		if (dayOfWeek !== 0 && dayOfWeek !== 6) {
			addedDays++;
		}
	}

	return result;
}

/**
 * Date를 YYYY-MM-DD 형식으로 변환
 */
function formatDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

/**
 * 단계별 진행률 계산
 */
function getStageProgress(parsedPlan: ParsedPlan, stageNumber: number): number {
	const stage = parsedPlan.stages.find((s) => s.stage === stageNumber);
	if (!stage) return 0;

	switch (stage.status) {
		case "completed":
			return 100;
		case "in_progress":
			return 50;
		default:
			return 0;
	}
}

/**
 * ParsedPlan에서 WBS 데이터 생성
 */
export function generateWbsFromPlan(
	parsedPlan: ParsedPlan,
	options: Partial<WbsGenerationOptions> = {},
): WbsData {
	const stageDurations: RequiredStageDurations = {
		stage1: options.stageDurations?.stage1 ?? DEFAULT_STAGE_DURATIONS.stage1,
		stage2: options.stageDurations?.stage2 ?? DEFAULT_STAGE_DURATIONS.stage2,
		stage3: options.stageDurations?.stage3 ?? DEFAULT_STAGE_DURATIONS.stage3,
		stage4: options.stageDurations?.stage4 ?? DEFAULT_STAGE_DURATIONS.stage4,
		stage5: options.stageDurations?.stage5 ?? DEFAULT_STAGE_DURATIONS.stage5,
	};

	const opts = {
		...DEFAULT_OPTIONS,
		...options,
		stageDurations,
	};

	const tasks: WbsTask[] = [];
	let currentDate = new Date(opts.startDate);
	let taskIdCounter = 1;

	// Stage 1: 데이터 설계
	const stage1Start = formatDate(currentDate);
	const stage1EndDate = addWorkingDays(currentDate, stageDurations.stage1 - 1);
	const stage1End = formatDate(stage1EndDate);
	const stage1Progress = getStageProgress(parsedPlan, 1);

	tasks.push({
		id: `${taskIdCounter}`,
		name: "Stage 1: 데이터 설계",
		start: stage1Start,
		end: stage1End,
		progress: stage1Progress,
		isGroup: true,
	});

	const stage1Id = `${taskIdCounter}`;
	taskIdCounter++;

	// Stage 1 하위 태스크
	let subTaskDate = new Date(currentDate);
	const stage1SubTasks = [
		"요구사항 분석",
		"데이터 모델 설계",
		"API 설계서 작성",
	];

	for (const taskName of stage1SubTasks) {
		const subStart = formatDate(subTaskDate);
		subTaskDate = addWorkingDays(subTaskDate, 1);
		const subEnd = formatDate(subTaskDate);

		tasks.push({
			id: `${stage1Id}.${tasks.filter((t) => t.parentId === stage1Id).length + 1}`,
			name: taskName,
			start: subStart,
			end: subEnd,
			progress: stage1Progress,
			parentId: stage1Id,
		});
	}

	// Stage 2: 스키마 구현
	currentDate = addWorkingDays(stage1EndDate, 1);
	const stage2Start = formatDate(currentDate);
	const stage2EndDate = addWorkingDays(currentDate, stageDurations.stage2 - 1);
	const stage2End = formatDate(stage2EndDate);
	const stage2Progress = getStageProgress(parsedPlan, 2);

	taskIdCounter++;
	tasks.push({
		id: `${taskIdCounter}`,
		name: "Stage 2: 스키마 구현",
		start: stage2Start,
		end: stage2End,
		progress: stage2Progress,
		isGroup: true,
		dependencies: [stage1Id],
	});

	const stage2Id = `${taskIdCounter}`;

	// Stage 2 하위 태스크
	const stage2SubTasks = [
		"Prisma 스키마 작성",
		"Entity 클래스 생성",
		"DTO 클래스 생성",
	];

	subTaskDate = new Date(currentDate);
	for (const taskName of stage2SubTasks) {
		const subStart = formatDate(subTaskDate);
		const subEnd = formatDate(subTaskDate); // 같은 날 완료

		tasks.push({
			id: `${stage2Id}.${tasks.filter((t) => t.parentId === stage2Id).length + 1}`,
			name: taskName,
			start: subStart,
			end: subEnd,
			progress: stage2Progress,
			parentId: stage2Id,
		});

		subTaskDate = addWorkingDays(subTaskDate, 1);
	}

	// Stage 3: 백엔드 로직
	currentDate = addWorkingDays(stage2EndDate, 1);
	const stage3Start = formatDate(currentDate);
	const stage3EndDate = addWorkingDays(currentDate, stageDurations.stage3 - 1);
	const stage3End = formatDate(stage3EndDate);
	const stage3Progress = getStageProgress(parsedPlan, 3);

	taskIdCounter++;
	tasks.push({
		id: `${taskIdCounter}`,
		name: "Stage 3: 백엔드 로직",
		start: stage3Start,
		end: stage3End,
		progress: stage3Progress,
		isGroup: true,
		dependencies: [stage2Id],
	});

	const stage3Id = `${taskIdCounter}`;

	// 백엔드 태스크 (기획서에서 파싱된 것 또는 기본값)
	const backendTasks =
		parsedPlan.backendTasks.length > 0
			? parsedPlan.backendTasks.map((t) => t.name)
			: [
					"Repository 구현",
					"Service 비즈니스 로직",
					"Controller API 엔드포인트",
				];

	subTaskDate = new Date(currentDate);
	const daysPerBackendTask = Math.max(
		1,
		Math.floor(stageDurations.stage3 / backendTasks.length),
	);

	for (const taskName of backendTasks) {
		const subStart = formatDate(subTaskDate);
		subTaskDate = addWorkingDays(subTaskDate, daysPerBackendTask - 1);
		const subEnd = formatDate(subTaskDate);
		subTaskDate = addWorkingDays(subTaskDate, 1);

		tasks.push({
			id: `${stage3Id}.${tasks.filter((t) => t.parentId === stage3Id).length + 1}`,
			name: taskName,
			start: subStart,
			end: subEnd,
			progress: stage3Progress,
			parentId: stage3Id,
		});
	}

	// Stage 4: 컴포넌트 구현
	currentDate = addWorkingDays(stage3EndDate, 1);
	const stage4Start = formatDate(currentDate);
	const stage4EndDate = addWorkingDays(currentDate, stageDurations.stage4 - 1);
	const stage4End = formatDate(stage4EndDate);
	const stage4Progress = getStageProgress(parsedPlan, 4);

	taskIdCounter++;
	tasks.push({
		id: `${taskIdCounter}`,
		name: "Stage 4: 컴포넌트 구현",
		start: stage4Start,
		end: stage4End,
		progress: stage4Progress,
		isGroup: true,
		dependencies: [stage3Id],
	});

	const stage4Id = `${taskIdCounter}`;

	// 프론트엔드 태스크 (기획서에서 파싱된 것 또는 기본값)
	const frontendTasks =
		parsedPlan.frontendTasks.length > 0
			? parsedPlan.frontendTasks.map((t) => t.name)
			: ["Pure UI 컴포넌트", "Widget 조합", "Feature 비즈니스 연결"];

	subTaskDate = new Date(currentDate);
	const daysPerFrontendTask = Math.max(
		1,
		Math.floor(stageDurations.stage4 / frontendTasks.length),
	);

	for (const taskName of frontendTasks) {
		const subStart = formatDate(subTaskDate);
		subTaskDate = addWorkingDays(subTaskDate, daysPerFrontendTask - 1);
		const subEnd = formatDate(subTaskDate);
		subTaskDate = addWorkingDays(subTaskDate, 1);

		tasks.push({
			id: `${stage4Id}.${tasks.filter((t) => t.parentId === stage4Id).length + 1}`,
			name: taskName,
			start: subStart,
			end: subEnd,
			progress: stage4Progress,
			parentId: stage4Id,
		});
	}

	// Stage 5: 페이지 통합
	currentDate = addWorkingDays(stage4EndDate, 1);
	const stage5Start = formatDate(currentDate);
	const stage5EndDate = addWorkingDays(currentDate, stageDurations.stage5 - 1);
	const stage5End = formatDate(stage5EndDate);
	const stage5Progress = getStageProgress(parsedPlan, 5);

	taskIdCounter++;
	tasks.push({
		id: `${taskIdCounter}`,
		name: "Stage 5: 페이지 통합",
		start: stage5Start,
		end: stage5End,
		progress: stage5Progress,
		isGroup: true,
		dependencies: [stage4Id],
	});

	const stage5Id = `${taskIdCounter}`;

	// 화면 통합 태스크 (기획서에서 파싱된 것 또는 기본값)
	const screenTasks =
		parsedPlan.screens.length > 0
			? parsedPlan.screens.map((s) => `${s.name} 페이지 구현`)
			: ["페이지 컴포넌트", "라우팅 설정", "통합 테스트"];

	subTaskDate = new Date(currentDate);
	const daysPerScreenTask = Math.max(
		1,
		Math.floor(stageDurations.stage5 / screenTasks.length),
	);

	for (const taskName of screenTasks) {
		const subStart = formatDate(subTaskDate);
		subTaskDate = addWorkingDays(subTaskDate, daysPerScreenTask - 1);
		const subEnd = formatDate(subTaskDate);
		subTaskDate = addWorkingDays(subTaskDate, 1);

		tasks.push({
			id: `${stage5Id}.${tasks.filter((t) => t.parentId === stage5Id).length + 1}`,
			name: taskName,
			start: subStart,
			end: subEnd,
			progress: stage5Progress,
			parentId: stage5Id,
		});
	}

	// 테스트 및 QA (선택 사항)
	if (opts.includeTestingPhase) {
		currentDate = addWorkingDays(stage5EndDate, 1);
		const testStart = formatDate(currentDate);
		const testEndDate = addWorkingDays(currentDate, opts.testingDuration - 1);
		const testEnd = formatDate(testEndDate);

		taskIdCounter++;
		tasks.push({
			id: `${taskIdCounter}`,
			name: "테스트 및 QA",
			start: testStart,
			end: testEnd,
			progress: 0,
			isGroup: true,
			dependencies: [stage5Id],
		});

		const testId = `${taskIdCounter}`;

		const testSubTasks = [
			"단위 테스트 작성",
			"통합 테스트",
			"사용자 수용 테스트 (UAT)",
		];

		subTaskDate = new Date(currentDate);
		for (const taskName of testSubTasks) {
			const subStart = formatDate(subTaskDate);
			const subEnd = formatDate(subTaskDate);

			tasks.push({
				id: `${testId}.${tasks.filter((t) => t.parentId === testId).length + 1}`,
				name: taskName,
				start: subStart,
				end: subEnd,
				progress: 0,
				parentId: testId,
			});

			subTaskDate = addWorkingDays(subTaskDate, 1);
		}
	}

	// WBS 데이터 생성
	const now = new Date().toISOString();

	return {
		id: parsedPlan.id,
		name: parsedPlan.name,
		description: `${parsedPlan.name} WBS (자동 생성)`,
		startDate: opts.startDate,
		tasks,
		metadata: {
			createdAt: now,
			updatedAt: now,
			sourceType: "plan",
			sourcePath: `plans/${parsedPlan.id}`,
		},
	};
}

/**
 * WBS 데이터 검증
 */
export function validateWbsData(wbs: WbsData): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!wbs.id) {
		errors.push("WBS ID가 필요합니다");
	}

	if (!wbs.name) {
		errors.push("WBS 이름이 필요합니다");
	}

	if (!wbs.tasks || wbs.tasks.length === 0) {
		errors.push("최소 하나의 태스크가 필요합니다");
	}

	// 태스크 검증
	const taskIds = new Set<string>();
	for (const task of wbs.tasks) {
		if (!task.id) {
			errors.push("모든 태스크에 ID가 필요합니다");
		}

		if (taskIds.has(task.id)) {
			errors.push(`중복된 태스크 ID: ${task.id}`);
		}
		taskIds.add(task.id);

		if (!task.start || !task.end) {
			errors.push(`태스크 ${task.id}에 시작일/종료일이 필요합니다`);
		}

		if (task.progress < 0 || task.progress > 100) {
			errors.push(`태스크 ${task.id}의 진행률이 유효하지 않습니다 (0-100)`);
		}

		// 종속성 검증
		if (task.dependencies) {
			for (const depId of task.dependencies) {
				if (!taskIds.has(depId) && !wbs.tasks.some((t) => t.id === depId)) {
					errors.push(
						`태스크 ${task.id}의 종속성 ${depId}가 존재하지 않습니다`,
					);
				}
			}
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
