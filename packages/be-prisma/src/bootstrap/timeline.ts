import { createHash } from "node:crypto";

import {
	exerciseCatalogSeedData,
	sessionLoadProfileSeedData,
	sessionTemplateSeedData,
	timelineSeedData,
} from "../demo-data";
import type { PrismaClient } from "../generated/client/client";
import {
	RecurringDayOfWeek,
	RepeatCycleTypes,
	SessionTypes,
} from "../generated/client/enums";

/**
 * seed key에서 결정론적 UUID를 만듭니다.
 *
 * 랜덤 UUID를 쓰면 bootstrap 재실행 때마다 새로운 row가 생기므로,
 * 같은 논리 엔티티를 다시 찾기 위한 안정 id가 필요합니다.
 */
function stableUuid(seedKey: string): string {
	// Demo rows use deterministic ids so rerunning bootstrap updates the same
	// logical records instead of generating duplicates.
	const hex = createHash("md5").update(seedKey).digest("hex");
	const part1 = hex.slice(0, 8);
	const part2 = hex.slice(8, 12);
	const part3 = `4${hex.slice(13, 16)}`;
	const variantNibble = (
		(Number.parseInt(hex.slice(16, 17), 16) & 0x3) |
		0x8
	).toString(16);
	const part4 = `${variantNibble}${hex.slice(17, 20)}`;
	const part5 = hex.slice(20, 32);
	return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

/**
 * seed key를 작은 정수 범위로 투영합니다.
 *
 * 난수처럼 보이지만 입력이 같으면 항상 같은 값을 내므로, 데모 데이터에 변주를 주면서도
 * 재실행 결과를 고정할 수 있습니다.
 */
function hashToInt(seedKey: string, modulo: number): number {
	// Pseudo-random, but deterministic for a given seed key.
	const hex = createHash("sha1").update(seedKey).digest("hex");
	const value = Number.parseInt(hex.slice(0, 12), 16);
	return value % modulo;
}

/**
 * 운동 난이도에서 대략적인 목표 RPE를 추정합니다.
 */
function estimateExerciseRpe(
	difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
) {
	if (difficulty === "ADVANCED") return 8;
	if (difficulty === "INTERMEDIATE") return 7;
	return 5;
}

/**
 * 운동 카테고리별 권장 휴식 시간을 반환합니다.
 */
function recommendedExerciseRestSec(
	category: "strength" | "cardio" | "core" | "mobility",
) {
	if (category === "strength") return 75;
	if (category === "cardio") return 35;
	if (category === "core") return 45;
	return 60;
}

/**
 * 최근/중간/과거 시즌 밴드 안에서 자연스러운 시작 시각을 생성합니다.
 *
 * bootstrap 데이터가 모두 "지금 막 생성된 것"처럼 몰리지 않게 하면서도,
 * seasonTag가 의미하는 recency 범위는 유지하는 데 목적이 있습니다.
 */
function dateByRecencyBand(
	seedKey: string,
	seasonTag: "recent" | "mid" | "archive",
): Date {
	// Generate timestamps that look organic while keeping each seed bucket inside
	// a controlled recency window.
	const now = new Date();
	const hourBuckets = [6, 7, 9, 12, 18, 19, 20];
	const minuteBuckets = [0, 10, 30, 40, 50];

	let minDaysAgo = 0;
	let maxDaysAgo = 0;

	if (seasonTag === "recent") {
		minDaysAgo = 0;
		maxDaysAgo = 28;
	} else if (seasonTag === "mid") {
		minDaysAgo = 29;
		maxDaysAgo = 120;
	} else {
		minDaysAgo = 121;
		maxDaysAgo = 260;
	}

	const range = maxDaysAgo - minDaysAgo + 1;
	const biasedRaw = hashToInt(`${seedKey}:days`, 1000) / 999;
	const biased =
		seasonTag === "recent"
			? biasedRaw ** 2
			: seasonTag === "archive"
				? Math.sqrt(biasedRaw)
				: biasedRaw;
	const daysAgo = minDaysAgo + Math.floor(range * biased);

	const startDate = new Date(now);
	startDate.setSeconds(0, 0);
	startDate.setDate(startDate.getDate() - daysAgo);
	startDate.setHours(
		hourBuckets[hashToInt(`${seedKey}:hour`, hourBuckets.length)],
		minuteBuckets[hashToInt(`${seedKey}:minute`, minuteBuckets.length)],
		0,
		0,
	);

	return startDate;
}

/**
 * timeline, session, routine, exercise 관련 데모 데이터를 일괄 생성합니다.
 *
 * 이 함수는 단순 삽입이 아니라 "fitnessCenter별 catalog -> routine/activity -> session/program"
 * 순서로 계층을 만들어 실제 운영 데이터처럼 보이는 관계를 구성합니다.
 */
export async function createTimelineSessionExerciseDomainData(
	prisma: PrismaClient,
): Promise<void> {
	console.log("\n========================================");
	console.log("Timeline / Session / Exercise 시드 데이터 삽입 중...");
	console.log("========================================");

	const timelineFitnessCenterNames = [
		...new Set(timelineSeedData.map((item) => item.fitnessCenterName)),
	];
	const createdByEmails = [
		...new Set([
			...timelineSeedData.map((item) => item.createdByEmail),
			...sessionLoadProfileSeedData.map((item) => item.userEmail),
		]),
	];

	// Load reusable relations once up front; the rest of the function mostly
	// works from these in-memory maps.
	const [fitnessCenters, createdByUsers, fallbackUser] = await Promise.all([
		prisma.fitnessCenter.findMany({
			where: { name: { in: timelineFitnessCenterNames } },
		}),
		prisma.user.findMany({ where: { email: { in: createdByEmails } } }),
		prisma.user.findFirst({ where: { email: "admin@plate.com" } }),
	]);

	if (!fallbackUser) {
		throw new Error("기본 시드 유저(admin@plate.com)를 찾을 수 없습니다.");
	}

	const fitnessCenterByName = new Map(
		fitnessCenters.map((fitnessCenter) => [fitnessCenter.name, fitnessCenter]),
	);
	const userByCreatedByEmail = new Map(
		createdByUsers.map((user) => [user.email, user]),
	);
	const loadProfileByEmail = new Map(
		sessionLoadProfileSeedData.map((profile) => [profile.userEmail, profile]),
	);

	const timelinesById = new Map<
		string,
		{
			id: string;
			fitnessCenterName: string;
			createdById: string | null;
		}
	>();
	let timelineCreated = 0;
	let timelineUpdated = 0;

	for (const timelineData of timelineSeedData) {
		const fitnessCenter = fitnessCenterByName.get(timelineData.fitnessCenterName);
		if (!fitnessCenter) {
			console.warn(`  - FitnessCenter 누락으로 Timeline 스킵: ${timelineData.name}`);
			continue;
		}

		const createdBy = userByCreatedByEmail.get(timelineData.createdByEmail);
		const spaceId = fitnessCenter.spaceId;
		const existingTimeline = await prisma.timeline.findUnique({
			where: { id: timelineData.id },
		});

		await prisma.timeline.upsert({
			where: { id: timelineData.id },
			update: {
				name: timelineData.name,
				description: timelineData.description,
				spaceId,
				createdById: createdBy?.id ?? null,
			},
			create: {
				id: timelineData.id,
				name: timelineData.name,
				description: timelineData.description,
				spaceId,
				createdById: createdBy?.id,
			},
		});

		timelinesById.set(timelineData.id, {
			id: timelineData.id,
			fitnessCenterName: timelineData.fitnessCenterName,
			createdById: createdBy?.id ?? null,
		});

		if (existingTimeline) {
			timelineUpdated++;
		} else {
			timelineCreated++;
		}
	}

	const taskIdsByFitnessCenter = new Map<string, string[]>();
	let taskCreated = 0;
	let exerciseCreated = 0;

	// Build a task/exercise catalog per fitnessCenter first. Routines and sessions later
	// only choose from the per-fitnessCenter ids assembled here.
	for (const fitnessCenterName of timelineFitnessCenterNames) {
		const fitnessCenter = fitnessCenterByName.get(fitnessCenterName);
		if (!fitnessCenter) continue;

		const timelineCreatedByEmail = timelineSeedData.find(
			(item) => item.fitnessCenterName === fitnessCenterName,
		)?.createdByEmail;
		const createdById = timelineCreatedByEmail
			? (userByCreatedByEmail.get(timelineCreatedByEmail)?.id ??
				fallbackUser.id)
			: fallbackUser.id;
		const spaceId = fitnessCenter.spaceId;

		const selectedTaskIds: string[] = [];

		for (const exerciseCatalog of exerciseCatalogSeedData) {
			const shouldInclude =
				hashToInt(
					`${fitnessCenterName}:${exerciseCatalog.code}:include`,
					100,
				) <
				(fitnessCenterName.includes("F45") || fitnessCenterName.includes("크로스핏")
					? 78
					: 62);

			if (!shouldInclude) continue;

			const taskId = stableUuid(
				`task:${fitnessCenterName}:${exerciseCatalog.code}`,
			);
			const exerciseId = stableUuid(
				`exercise:${fitnessCenterName}:${exerciseCatalog.code}`,
			);

			const existingTask = await prisma.task.findUnique({
				where: { id: taskId },
			});
			await prisma.task.upsert({
				where: { id: taskId },
				update: {
					spaceId,
					createdById: createdById ?? null,
				},
				create: {
					id: taskId,
					spaceId,
					createdById,
				},
			});

			if (!existingTask) {
				taskCreated++;
			}

			const duration = Math.max(
				30,
				exerciseCatalog.typicalDurationSec +
					(hashToInt(
						`${fitnessCenterName}:${exerciseCatalog.code}:duration`,
						31,
					) -
						15),
			);
			const count = Math.max(
				1,
				exerciseCatalog.typicalCount +
					(hashToInt(
						`${fitnessCenterName}:${exerciseCatalog.code}:count`,
						7,
					) - 3),
			);
			const estimatedCalories = Math.round(
				(duration / 60) * exerciseCatalog.caloriesPerMinute,
			);
			const targetRpe = estimateExerciseRpe(exerciseCatalog.difficulty);
			const recommendedRestSec = recommendedExerciseRestSec(
				exerciseCatalog.category,
			);
			const exerciseDescription = `${exerciseCatalog.description} | 카테고리:${exerciseCatalog.category} | 난이도:${exerciseCatalog.difficulty} | 목표RPE:${targetRpe} | 권장휴식:${recommendedRestSec}초 | 예상소모:${estimatedCalories}kcal`;

			const existingExercise = await prisma.exercise.findUnique({
				where: { id: exerciseId },
			});
			await prisma.exercise.upsert({
				where: { id: exerciseId },
				update: {
					name: exerciseCatalog.name,
					description: exerciseDescription,
					duration,
					count,
					taskId,
				},
				create: {
					id: exerciseId,
					name: exerciseCatalog.name,
					description: exerciseDescription,
					duration,
					count,
					taskId,
				},
			});

			if (!existingExercise) {
				exerciseCreated++;
			}

			selectedTaskIds.push(taskId);
		}

		taskIdsByFitnessCenter.set(fitnessCenterName, selectedTaskIds);
	}

	const routinesByFitnessCenter = new Map<
		string,
		Array<{ id: string; level: string }>
	>();
	let routineCreated = 0;
	let activityCreated = 0;

	// Routines are the reusable workout blueprints that session programs will
	// attach to in the final phase.
	for (const fitnessCenterName of timelineFitnessCenterNames) {
		const fitnessCenter = fitnessCenterByName.get(fitnessCenterName);
		const taskIds = taskIdsByFitnessCenter.get(fitnessCenterName) ?? [];
		if (!fitnessCenter || taskIds.length < 4) continue;

		const createdByEmail = timelineSeedData.find(
			(item) => item.fitnessCenterName === fitnessCenterName,
		)?.createdByEmail;
		const createdById = createdByEmail
			? (userByCreatedByEmail.get(createdByEmail)?.id ?? fallbackUser.id)
			: fallbackUser.id;
		const spaceId = fitnessCenter.spaceId;

		const routineCount = Math.min(
			4,
			Math.max(2, Math.floor(taskIds.length / 4)),
		);
		const fitnessCenterRoutines: Array<{ id: string; level: string }> = [];

		for (let idx = 0; idx < routineCount; idx++) {
			const template =
				sessionTemplateSeedData[idx % sessionTemplateSeedData.length];
			const routineId = stableUuid(
				`routine:${fitnessCenterName}:${template.code}:${idx}`,
			);
			const existingRoutine = await prisma.routine.findUnique({
				where: { id: routineId },
			});

			await prisma.routine.upsert({
				where: { id: routineId },
				update: {
					spaceId,
					createdById: createdById ?? null,
					name: `${template.name} 루틴 ${idx + 1}`,
					label: `${fitnessCenterName} ${template.level}`,
				},
				create: {
					id: routineId,
					spaceId,
					createdById,
					name: `${template.name} 루틴 ${idx + 1}`,
					label: `${fitnessCenterName} ${template.level}`,
				},
			});

			if (!existingRoutine) {
				routineCreated++;
			}

			for (let order = 1; order <= 4; order++) {
				const taskId = taskIds[(idx * 3 + order) % taskIds.length];
				const activityId = stableUuid(`activity:${routineId}:${taskId}`);
				const existingActivity = await prisma.activity.findUnique({
					where: { id: activityId },
				});

				await prisma.activity.upsert({
					where: { id: activityId },
					update: {
						routineId,
						taskId,
						order,
						repetitions:
							template.focus === "strength"
								? order % 2 === 0
									? 5
									: 4
								: template.focus === "metcon"
									? order % 2 === 0
										? 4
										: 3
									: 3,
						restTime: Math.max(
							20,
							template.recommendedRestSec + (order % 2 === 0 ? 10 : -10),
						),
						notes:
							order === 4
								? `${template.coachNote} | 목표 RPE ${template.targetRpe}`
								: `${template.workRestScheme}`,
					},
					create: {
						id: activityId,
						routineId,
						taskId,
						order,
						repetitions:
							template.focus === "strength"
								? order % 2 === 0
									? 5
									: 4
								: template.focus === "metcon"
									? order % 2 === 0
										? 4
										: 3
									: 3,
						restTime: Math.max(
							20,
							template.recommendedRestSec + (order % 2 === 0 ? 10 : -10),
						),
						notes:
							order === 4
								? `${template.coachNote} | 목표 RPE ${template.targetRpe}`
								: `${template.workRestScheme}`,
					},
				});

				if (!existingActivity) {
					activityCreated++;
				}
			}

			fitnessCenterRoutines.push({ id: routineId, level: template.level });
		}

		routinesByFitnessCenter.set(fitnessCenterName, fitnessCenterRoutines);
	}

	const recurringDayMap = [
		RecurringDayOfWeek.SUNDAY,
		RecurringDayOfWeek.MONDAY,
		RecurringDayOfWeek.TUESDAY,
		RecurringDayOfWeek.WEDNESDAY,
		RecurringDayOfWeek.THURSDAY,
		RecurringDayOfWeek.FRIDAY,
		RecurringDayOfWeek.SATURDAY,
	] as const;

	let sessionCreated = 0;
	let programCreated = 0;

	// Final phase: generate actual scheduled sessions, then connect one routine
	// to each session as a program when routine data exists for that fitnessCenter.
	for (const timelineMeta of timelineSeedData) {
		const timeline = timelinesById.get(timelineMeta.id);
		if (!timeline) continue;

		const loadProfile = loadProfileByEmail.get(timelineMeta.createdByEmail);
		const baseCount =
			timelineMeta.seasonTag === "recent"
				? 24
				: timelineMeta.seasonTag === "mid"
					? 14
					: 8;
		const tierFactor =
			loadProfile?.tier === "HEAVY"
				? 1.3
				: loadProfile?.tier === "LIGHT"
					? 0.7
					: 1;
		const preferredFactor = loadProfile?.preferredFitnessCenterNames.includes(
			timelineMeta.fitnessCenterName,
		)
			? 1.15
			: 0.85;
		const sessionCount = Math.max(
			6,
			Math.round(baseCount * tierFactor * preferredFactor),
		);

		const fitnessCenterRoutines =
			routinesByFitnessCenter.get(timelineMeta.fitnessCenterName) ?? [];

		for (let index = 0; index < sessionCount; index++) {
			const seasonTemplateShift =
				timelineMeta.seasonTag === "recent"
					? 0
					: timelineMeta.seasonTag === "mid"
						? 2
						: 4;
			const templateNoise = hashToInt(
				`${timelineMeta.id}:${index}:template-noise`,
				3,
			);
			const templateIndex =
				(index + seasonTemplateShift + templateNoise) %
				sessionTemplateSeedData.length;
			const template = sessionTemplateSeedData[templateIndex];
			const sessionId = stableUuid(`session:${timelineMeta.id}:${index}`);
			const startDateTime = dateByRecencyBand(
				`session:${timelineMeta.id}:${index}`,
				timelineMeta.seasonTag,
			);
			const durationMinutes = Math.min(
				95,
				Math.max(
					35,
					template.durationMin + (hashToInt(`${sessionId}:duration`, 17) - 8),
				),
			);

			const typeRoll = hashToInt(`${sessionId}:type`, 100);
			const sessionType =
				typeRoll < 62
					? SessionTypes.ONE_TIME
					: typeRoll < 86
						? SessionTypes.RECURRING
						: SessionTypes.ONE_TIME_RANGE;

			const repeatCycleType =
				sessionType === SessionTypes.RECURRING
					? hashToInt(`${sessionId}:repeat`, 100) < 82
						? RepeatCycleTypes.WEEKLY
						: RepeatCycleTypes.MONTHLY
					: null;
			const recurringDay =
				sessionType === SessionTypes.RECURRING
					? recurringDayMap[startDateTime.getDay()]
					: null;

			const endDateTime = new Date(startDateTime);
			if (sessionType === SessionTypes.ONE_TIME_RANGE) {
				endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes * 2);
			} else {
				endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);
			}

			const existingSession = await prisma.session.findUnique({
				where: { id: sessionId },
			});

			await prisma.session.upsert({
				where: { id: sessionId },
				update: {
					timelineId: timeline.id,
					type: sessionType,
					name: `${template.name} ${index + 1}`,
					description: `${timelineMeta.fitnessCenterName} ${template.focus} 세션 | ${template.phaseWeek} | 목표 RPE ${template.targetRpe} | 권장 휴식 ${template.recommendedRestSec}초`,
					startDateTime,
					endDateTime,
					repeatCycleType,
					recurringDayOfWeek: recurringDay,
				},
				create: {
					id: sessionId,
					timelineId: timeline.id,
					type: sessionType,
					name: `${template.name} ${index + 1}`,
					description: `${timelineMeta.fitnessCenterName} ${template.focus} 세션 | ${template.phaseWeek} | 목표 RPE ${template.targetRpe} | 권장 휴식 ${template.recommendedRestSec}초`,
					startDateTime,
					endDateTime,
					repeatCycleType,
					recurringDayOfWeek: recurringDay,
				},
			});

			if (!existingSession) {
				sessionCreated++;
			}

			if (fitnessCenterRoutines.length > 0) {
				const programCapacity =
					template.level === "고급"
						? 14
						: template.focus === "recovery"
							? 20
							: 18;

				const pickedRoutine =
					fitnessCenterRoutines[
						hashToInt(`${sessionId}:routine`, fitnessCenterRoutines.length)
					];
				const programId = stableUuid(
					`program:${sessionId}:${pickedRoutine.id}`,
				);
				const existingProgram = await prisma.program.findUnique({
					where: { id: programId },
				});

				await prisma.program.upsert({
					where: { id: programId },
					update: {
						routineId: pickedRoutine.id,
						sessionId,
						instructorId: timeline.createdById ?? fallbackUser.id,
						capacity: programCapacity,
						name: `${template.name} ${template.phaseWeek} 프로그램`,
						level: pickedRoutine.level,
					},
					create: {
						id: programId,
						routineId: pickedRoutine.id,
						sessionId,
						instructorId: timeline.createdById ?? fallbackUser.id,
						capacity: programCapacity,
						name: `${template.name} ${template.phaseWeek} 프로그램`,
						level: pickedRoutine.level,
					},
				});

				if (!existingProgram) {
					programCreated++;
				}
			}
		}
	}

	console.log(
		`✅ Timeline/Session/Exercise 시드 완료! Timeline(신규 ${timelineCreated}, 갱신 ${timelineUpdated}), Session(신규 ${sessionCreated}), Program(신규 ${programCreated}), Task(신규 ${taskCreated}), Exercise(신규 ${exerciseCreated}), Routine(신규 ${routineCreated}), Activity(신규 ${activityCreated})`,
	);
}
