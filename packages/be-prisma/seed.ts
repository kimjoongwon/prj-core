import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { config } from "dotenv";

// Load .env.local from packages/prisma directory
config({ path: resolve(__dirname, ".env.local") });

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt";
import * as pg from "pg";

import { ensureSecurityPolicyDefaults } from "./src/bootstrap/defaults";
import { ensureBootstrapTemplates } from "./src/bootstrap/templates";
import {
	exerciseCatalogSeedData,
	groundSeedData,
	sessionLoadProfileSeedData,
	sessionTemplateSeedData,
	timelineSeedData,
	albumSeedData,
	albumEntrySeedData,
	assetSeedData,
	derivativeSeedData,
	documentDetailSeedData,
	folderSeedData,
	imageDetailSeedData,
	videoDetailSeedData,
	inquiryMessageSeedData,
	inquiryParticipantSeedData,
	inquirySeedData,
	inquiryTagMasterData,
	inquiryThreadSeedData,
	sentimentAnalysisSeedData,
	userGroundMapping,
	userSeedData,
} from "./demo-data";
import type { Ground, Role } from "./src/generated/client/client";
import { Prisma, PrismaClient } from "./src/generated/client/client";
import { RecurringDayOfWeek, RepeatCycleTypes, SessionTypes } from "./src/generated/client/enums";
import { SYSTEM_SPACE_ID } from "./src/reference-data/constants";
import { syncReferenceData } from "./src/reference-data/sync-reference-data";

// Prisma 7: Adapter 패턴으로 PrismaClient 생성
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function getRequiredRole(
	roles: Record<string, Role>,
	roleName: string,
): Role {
	const role = roles[roleName];
	if (!role) {
		throw new Error(`Required seeded role is missing: ${roleName}`);
	}

	return role;
}

async function main() {
	const { roles } = await syncReferenceData(prisma);
	const fullAccessRole = getRequiredRole(roles, "FULL_ACCESS");
	const manageRole = getRequiredRole(roles, "MANAGE");
	const viewRole = getRequiredRole(roles, "VIEW");

	// Super Admin 데이터를 demo-data에서 가져오기
	const superAdminData = userSeedData.find((u) => u.role === "FULL_ACCESS");
	if (!superAdminData)
		throw new Error("FULL_ACCESS 유저 데이터가 demo-data에 없습니다.");

	const hashedPassword = await hash(superAdminData.password, 10);

	// Super Admin 유저 생성 (demo-data 기반)
	const superAdminUser = await prisma.user.upsert({
		where: {
			phone: superAdminData.phone,
		},
		update: {},
		create: {
			name: superAdminData.profile.name,
			phone: superAdminData.phone,
			email: superAdminData.email,
			password: hashedPassword,
			profiles: {
				create: {
					name: superAdminData.profile.name,
					nickname: superAdminData.profile.nickname,
				},
			},
		},
	});

	// System Space에 Tenant가 없으면 생성 (FULL_ACCESS 전용)
	const existingTenant = await prisma.tenant.findFirst({
		where: {
			spaceId: SYSTEM_SPACE_ID,
			roleId: fullAccessRole.id,
		},
	});

	if (!existingTenant) {
		await prisma.tenant.create({
			data: {
				userId: superAdminUser.id,
				spaceId: SYSTEM_SPACE_ID,
				roleId: fullAccessRole.id,
			},
		});
		console.log("System Space Tenant 생성 완료 (FULL_ACCESS 전용)");
	}

	console.log(`System Space 준비 완료 (id=${SYSTEM_SPACE_ID})`);

	// System Space Ground 생성 (demo-data 기반)
	const systemGroundData = groundSeedData.find((g) => g.isSystem);
	if (systemGroundData) {
		await prisma.ground.upsert({
			where: { businessNo: systemGroundData.businessNo },
			update: {
				name: systemGroundData.name,
				label: systemGroundData.label,
				address: systemGroundData.address,
				phone: systemGroundData.phone,
				email: systemGroundData.email,
			},
			create: {
				name: systemGroundData.name,
				label: systemGroundData.label,
				address: systemGroundData.address,
				phone: systemGroundData.phone,
				email: systemGroundData.email,
				businessNo: systemGroundData.businessNo,
				spaceId: SYSTEM_SPACE_ID,
			},
		});
		console.log(`System Ground 생성 완료: ${systemGroundData.name}`);
	}

	// Group 생성을 위한 tenant 조회 (System Space의 첫 번째 tenant)
	const firstTenant = await prisma.tenant.findFirst({
		where: { spaceId: SYSTEM_SPACE_ID },
	});

	if (firstTenant) {
		for (const group of spaceGroupSeed) {
			const existingGroup = await prisma.group.findFirst({
				where: {
					name: group.name,
					spaceId: firstTenant.spaceId,
				},
			});

			if (!existingGroup) {
				await prisma.group.create({
					data: {
						spaceId: firstTenant.spaceId,
						name: group.name,
						type: "Space",
					},
				});
				console.log(`Group 생성 완료: ${group.name}`);
			} else {
				console.log(`Group 이미 존재: ${group.name}`);
			}
		}
	} else {
		console.error(
			"System Space의 tenant를 찾을 수 없어 Group을 생성할 수 없습니다.",
		);
	}

	// 일반 유저들과 그라운드 생성
	await createRegularUsersAndGrounds(manageRole, viewRole);

	// Ground Space에 BRANCH SpaceClassification 할당
	await classifyGroundSpacesAsBranch(SYSTEM_SPACE_ID);

	// 상위 SpaceCategory(ROOT) tenant → 하위 SpaceCategory(BRANCH) Space에 tenant 생성
	await createHierarchicalTenants(SYSTEM_SPACE_ID);

	// Timeline / Session / Exercise 도메인 데이터 생성
	await createTimelineSessionExerciseDomainData();

	// Bootstrap 전용 기본값 생성
	await ensureSecurityPolicyDefaults(prisma);

	// Asset Domain 데이터 생성
	await createAssetDomainData();

	// Template 생성
	await ensureBootstrapTemplates(prisma);

	// Inquiry Domain 데이터 생성
	await createInquiryDomainData();

	console.log({ superAdminUser });
}

async function createRegularUsersAndGrounds(adminRole: Role, _userRole: Role) {
	console.log("일반 유저들과 그라운드 생성 시작...");

	// 모든 Role 조회 (demo-data의 role 필드 사용을 위해)
	const allRoles = await prisma.role.findMany();
	const roleMap: Record<string, Role> = {};
	for (const role of allRoles) {
		roleMap[role.name] = role;
	}

	// 각 그라운드 생성
	const createdGrounds: Array<{
		ground: Ground;
		index: number;
		spaceId: string;
	}> = [];
	for (let i = 0; i < groundSeedData.length; i++) {
		const groundData = groundSeedData[i];
		if (groundData.isSystem) continue; // System Ground는 이미 생성됨

		try {
			// 그라운드가 이미 존재하는지 확인
			const existingGround = await prisma.ground.findFirst({
				where: { businessNo: groundData.businessNo },
			});

			if (!existingGround) {
				// Space 생성 (businessNo 기반으로 기존 확인)
				let space = await prisma.space.findFirst({
					where: {
						ground: {
							name: groundData.name,
						},
					},
				});

				if (!space) {
					space = await prisma.space.create({
						data: {},
					});
				}

				// 그라운드 관리자 유저 생성
				const adminUser = await prisma.user.upsert({
					where: {
						phone: groundData.phone,
					},
					update: {},
					create: {
						name: `${groundData.name} 관리자`,
						phone: groundData.phone,
						email: groundData.email,
						password: await hash("admin123!@#", 10),
						profiles: {
							create: {
								name: `${groundData.name} 관리자`,
								nickname: `${groundData.name}관리자`,
							},
						},
					},
				});

				// Tenant 생성 (그라운드 관리자용) - 중복 확인
				const existingTenant = await prisma.tenant.findFirst({
					where: {
						userId: adminUser.id,
						spaceId: space.id,
						roleId: adminRole.id,
					},
				});

				if (!existingTenant) {
					await prisma.tenant.create({
						data: {
							userId: adminUser.id,
							spaceId: space.id,
							roleId: adminRole.id,
						},
					});
				}

				// 그라운드 생성
				const ground = await prisma.ground.create({
					data: {
						name: groundData.name,
						label: groundData.label,
						address: groundData.address,
						phone: groundData.phone,
						email: groundData.email,
						businessNo: groundData.businessNo,
						spaceId: space.id,
					},
				});

				createdGrounds.push({
					ground,
					index: i,
					spaceId: space.id,
				});

				console.log(`그라운드 생성 완료: ${groundData.name}`);
			} else {
				console.log(`그라운드 이미 존재: ${groundData.name}`);
				createdGrounds.push({
					ground: existingGround,
					index: i,
					spaceId: existingGround.spaceId,
				});
			}
		} catch (error) {
			console.error(`그라운드 생성 실패 (${groundData.name}):`, error);
		}
	}

	// 일반 유저들 생성 및 그라운드에 할당
	for (let userIndex = 0; userIndex < userSeedData.length; userIndex++) {
		const userData = userSeedData[userIndex];
		// 이메일 기반으로 유저-그라운드 매핑 찾기
		const userMapping = userGroundMapping.find(
			(m) => m.userEmail === userData.email,
		);

		if (!userMapping) {
			console.log(`유저 매핑을 찾을 수 없음: ${userData.email}`);
			continue;
		}

		try {
			// 유저가 이미 존재하는지 확인
			const existingUser = await prisma.user.findFirst({
				where: { email: userData.email },
			});

			if (!existingUser) {
				const hashedPassword = await hash(userData.password, 10);

				// 유저가 소속될 그라운드들 (groundNames 기반으로 찾기)
				const userGrounds: Array<{
					ground: unknown;
					index: number;
					spaceId: string;
				}> = [];
				for (const groundName of userMapping.groundNames) {
					const groundInfo = createdGrounds.find(
						(g) => g.ground.name === groundName,
					);
					if (groundInfo) {
						userGrounds.push(groundInfo);
					}
				}

				if (userGrounds.length > 0) {
					// 유저 생성
					const user = await prisma.user.create({
						data: {
							name: userData.profile.name,
							phone: userData.phone,
							email: userData.email,
							password: hashedPassword,
							profiles: {
								create: {
									name: userData.profile.name,
									nickname: userData.profile.nickname,
								},
							},
						},
					});

					// 각 그라운드에 대한 Tenant 생성 (중복 확인)
					// userData.role 또는 기본값 "USER" 사용
					const assignedRole = roleMap[userData.role || "VIEW"];

					for (let i = 0; i < userGrounds.length; i++) {
						const groundInfo = userGrounds[i];
						const _isMain = i === 0; // 첫 번째 그라운드를 메인으로 설정

						const existingUserTenant = await prisma.tenant.findFirst({
							where: {
								userId: user.id,
								spaceId: groundInfo.spaceId,
								roleId: assignedRole.id,
							},
						});

						if (!existingUserTenant) {
							await prisma.tenant.create({
								data: {
									userId: user.id,
									spaceId: groundInfo.spaceId,
									roleId: assignedRole.id,
								},
							});
						}
					}

					console.log(
						`유저 생성 완료: ${userData.profile.name} [${userData.role || "VIEW"}] (그라운드 ${userGrounds.length}개 소속)`,
					);
				}
			} else {
				console.log(`유저 이미 존재: ${userData.profile.name}`);
			}
		} catch (error) {
			console.error(`일반 유저 생성 실패 (${userData.profile.name}):`, error);
		}
	}

	console.log("일반 유저들과 그라운드 생성 완료!");
}

function stableUuid(seedKey: string): string {
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

function hashToInt(seedKey: string, modulo: number): number {
	const hex = createHash("sha1").update(seedKey).digest("hex");
	const value = Number.parseInt(hex.slice(0, 12), 16);
	return value % modulo;
}

function estimateExerciseRpe(
	difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
) {
	if (difficulty === "ADVANCED") return 8;
	if (difficulty === "INTERMEDIATE") return 7;
	return 5;
}

function recommendedExerciseRestSec(
	category: "strength" | "cardio" | "core" | "mobility",
) {
	if (category === "strength") return 75;
	if (category === "cardio") return 35;
	if (category === "core") return 45;
	return 60;
}

function dateByRecencyBand(
	seedKey: string,
	seasonTag: "recent" | "mid" | "archive",
): Date {
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

async function createTimelineSessionExerciseDomainData() {
	console.log("\n========================================");
	console.log("Timeline / Session / Exercise 시드 데이터 삽입 중...");
	console.log("========================================");

	const timelineGroundNames = [
		...new Set(timelineSeedData.map((item) => item.groundName)),
	];
	const creatorEmails = [
		...new Set([
			...timelineSeedData.map((item) => item.creatorEmail),
			...sessionLoadProfileSeedData.map((item) => item.userEmail),
		]),
	];

	const [grounds, creators, fallbackUser] = await Promise.all([
		prisma.ground.findMany({
			where: { name: { in: timelineGroundNames } },
		}),
		prisma.user.findMany({ where: { email: { in: creatorEmails } } }),
		prisma.user.findFirst({ where: { email: "admin@plate.com" } }),
	]);

	if (!fallbackUser) {
		throw new Error("기본 시드 유저(admin@plate.com)를 찾을 수 없습니다.");
	}

	const groundByName = new Map(grounds.map((ground) => [ground.name, ground]));
	const creatorByEmail = new Map(creators.map((user) => [user.email, user]));
	const loadProfileByEmail = new Map(
		sessionLoadProfileSeedData.map((profile) => [profile.userEmail, profile]),
	);

	const timelinesById = new Map<
		string,
		{ id: string; groundName: string; creatorId: string | null }
	>();
	let timelineCreated = 0;
	let timelineUpdated = 0;

	for (const timelineData of timelineSeedData) {
		const ground = groundByName.get(timelineData.groundName);
		if (!ground) {
			console.warn(`  - Ground 누락으로 Timeline 스킵: ${timelineData.name}`);
			continue;
		}

		const creator = creatorByEmail.get(timelineData.creatorEmail);
		const existingTimeline = await prisma.timeline.findUnique({
			where: { id: timelineData.id },
		});

		await prisma.timeline.upsert({
			where: { id: timelineData.id },
			update: {
				name: timelineData.name,
				description: timelineData.description,
				spaceId: ground.spaceId,
				creatorId: creator?.id ?? null,
			},
			create: {
				id: timelineData.id,
				name: timelineData.name,
				description: timelineData.description,
				spaceId: ground.spaceId,
				creatorId: creator?.id,
			},
		});

		timelinesById.set(timelineData.id, {
			id: timelineData.id,
			groundName: timelineData.groundName,
			creatorId: creator?.id ?? null,
		});

		if (existingTimeline) {
			timelineUpdated++;
		} else {
			timelineCreated++;
		}
	}

	const taskIdsByGround = new Map<string, string[]>();
	let taskCreated = 0;
	let exerciseCreated = 0;

	for (const groundName of timelineGroundNames) {
		const ground = groundByName.get(groundName);
		if (!ground) continue;

		const timelineCreatorEmail = timelineSeedData.find(
			(item) => item.groundName === groundName,
		)?.creatorEmail;
		const creatorId = timelineCreatorEmail
			? (creatorByEmail.get(timelineCreatorEmail)?.id ?? fallbackUser?.id)
			: fallbackUser?.id;

		const selectedTaskIds: string[] = [];

		for (const exerciseCatalog of exerciseCatalogSeedData) {
			const shouldInclude =
				hashToInt(`${groundName}:${exerciseCatalog.code}:include`, 100) <
				(groundName.includes("F45") || groundName.includes("크로스핏")
					? 78
					: 62);

			if (!shouldInclude) continue;

			const taskId = stableUuid(`task:${groundName}:${exerciseCatalog.code}`);
			const exerciseId = stableUuid(
				`exercise:${groundName}:${exerciseCatalog.code}`,
			);

			const existingTask = await prisma.task.findUnique({
				where: { id: taskId },
			});
			await prisma.task.upsert({
				where: { id: taskId },
				update: {
					spaceId: ground.spaceId,
					creatorId: creatorId ?? null,
				},
				create: {
					id: taskId,
					spaceId: ground.spaceId,
					creatorId,
				},
			});

			if (!existingTask) {
				taskCreated++;
			}

			const duration = Math.max(
				30,
				exerciseCatalog.typicalDurationSec +
					(hashToInt(`${groundName}:${exerciseCatalog.code}:duration`, 31) -
						15),
			);
			const count = Math.max(
				1,
				exerciseCatalog.typicalCount +
					(hashToInt(`${groundName}:${exerciseCatalog.code}:count`, 7) - 3),
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

		taskIdsByGround.set(groundName, selectedTaskIds);
	}

	const routinesByGround = new Map<
		string,
		Array<{ id: string; level: string }>
	>();
	let routineCreated = 0;
	let activityCreated = 0;

	for (const groundName of timelineGroundNames) {
		const ground = groundByName.get(groundName);
		const taskIds = taskIdsByGround.get(groundName) ?? [];
		if (!ground || taskIds.length < 4) continue;

		const creatorEmail = timelineSeedData.find(
			(item) => item.groundName === groundName,
		)?.creatorEmail;
		const creatorId = creatorEmail
			? (creatorByEmail.get(creatorEmail)?.id ?? fallbackUser?.id)
			: fallbackUser?.id;

		const routineCount = Math.min(
			4,
			Math.max(2, Math.floor(taskIds.length / 4)),
		);
		const groundRoutines: Array<{ id: string; level: string }> = [];

		for (let idx = 0; idx < routineCount; idx++) {
			const template =
				sessionTemplateSeedData[idx % sessionTemplateSeedData.length];
			const routineId = stableUuid(
				`routine:${groundName}:${template.code}:${idx}`,
			);
			const existingRoutine = await prisma.routine.findUnique({
				where: { id: routineId },
			});

			await prisma.routine.upsert({
				where: { id: routineId },
				update: {
					spaceId: ground.spaceId,
					creatorId: creatorId ?? null,
					name: `${template.name} 루틴 ${idx + 1}`,
					label: `${groundName} ${template.level}`,
				},
				create: {
					id: routineId,
					spaceId: ground.spaceId,
					creatorId,
					name: `${template.name} 루틴 ${idx + 1}`,
					label: `${groundName} ${template.level}`,
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

			groundRoutines.push({ id: routineId, level: template.level });
		}

		routinesByGround.set(groundName, groundRoutines);
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

	for (const timelineMeta of timelineSeedData) {
		const timeline = timelinesById.get(timelineMeta.id);
		if (!timeline) continue;

		const loadProfile = loadProfileByEmail.get(timelineMeta.creatorEmail);
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
		const preferredFactor = loadProfile?.preferredGroundNames.includes(
			timelineMeta.groundName,
		)
			? 1.15
			: 0.85;
		const sessionCount = Math.max(
			6,
			Math.round(baseCount * tierFactor * preferredFactor),
		);

		const groundRoutines = routinesByGround.get(timelineMeta.groundName) ?? [];

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
					description: `${timelineMeta.groundName} ${template.focus} 세션 | ${template.phaseWeek} | 목표 RPE ${template.targetRpe} | 권장 휴식 ${template.recommendedRestSec}초`,
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
					description: `${timelineMeta.groundName} ${template.focus} 세션 | ${template.phaseWeek} | 목표 RPE ${template.targetRpe} | 권장 휴식 ${template.recommendedRestSec}초`,
					startDateTime,
					endDateTime,
					repeatCycleType,
					recurringDayOfWeek: recurringDay,
				},
			});

			if (!existingSession) {
				sessionCreated++;
			}

			if (groundRoutines.length > 0) {
				const programCapacity =
					template.level === "고급"
						? 14
						: template.focus === "recovery"
							? 20
							: 18;

				const pickedRoutine =
					groundRoutines[
						hashToInt(`${sessionId}:routine`, groundRoutines.length)
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
						instructorId: timeline.creatorId ?? fallbackUser.id,
						capacity: programCapacity,
						name: `${template.name} ${template.phaseWeek} 프로그램`,
						level: pickedRoutine.level,
					},
					create: {
						id: programId,
						routineId: pickedRoutine.id,
						sessionId,
						instructorId: timeline.creatorId ?? fallbackUser.id,
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

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

async function classifyGroundSpacesAsBranch(systemSpaceId: string) {
	console.log("Ground Space에 BRANCH SpaceClassification 할당 시작...");

	// BRANCH Category 조회
	const branchCategory = await prisma.category.findFirst({
		where: { name: "지점", type: "Space" },
	});

	if (!branchCategory) {
		console.error("BRANCH Space Category를 찾을 수 없습니다.");
		return;
	}

	// 모든 Ground 조회 (spaceId 포함)
	const grounds = await prisma.ground.findMany();

	let createdCount = 0;
	let skippedCount = 0;

	for (const ground of grounds) {
		// System Space의 Ground는 제외 (System Space는 ROOT)
		if (ground.spaceId === systemSpaceId) {
			continue;
		}

		// 이미 SpaceClassification이 존재하는지 확인 후 upsert
		await prisma.spaceClassification.upsert({
			where: { spaceId: ground.spaceId },
			create: {
				spaceId: ground.spaceId,
				categoryId: branchCategory.id,
			},
			update: {
				categoryId: branchCategory.id,
			},
		});
		createdCount++;
		console.log(
			`  - BRANCH 할당: ${ground.name} (spaceId=${ground.spaceId.slice(-8)})`,
		);
	}

	console.log(
		`Ground Space BRANCH 할당 완료! (생성: ${createdCount}개, 스킵: ${skippedCount}개)`,
	);
}

async function createHierarchicalTenants(systemSpaceId: string) {
	console.log("계층적 Tenant 생성 시작 (ROOT → BRANCH)...");

	// 1. ROOT Space(= System Space)의 tenant 목록 조회
	const rootTenants = await prisma.tenant.findMany({
		where: { spaceId: systemSpaceId },
	});

	if (rootTenants.length === 0) {
		console.log("ROOT Space에 tenant가 없어 스킵합니다.");
		return;
	}

	// 2. BRANCH 카테고리의 모든 Space 조회 (= Ground Space들)
	const branchSpaces = await prisma.space.findMany({
		where: {
			classification: {
				category: { name: "지점" },
			},
		},
	});

	if (branchSpaces.length === 0) {
		console.log("BRANCH Space가 없어 스킵합니다.");
		return;
	}

	let createdCount = 0;
	let skippedCount = 0;

	// 3. ROOT tenant의 각 사용자에 대해 모든 BRANCH Space에 동일 role로 tenant 생성
	for (const rootTenant of rootTenants) {
		for (const branchSpace of branchSpaces) {
			const existing = await prisma.tenant.findFirst({
				where: {
					userId: rootTenant.userId,
					spaceId: branchSpace.id,
					roleId: rootTenant.roleId,
				},
			});

			if (!existing) {
				await prisma.tenant.create({
					data: {
						userId: rootTenant.userId,
						spaceId: branchSpace.id,
						roleId: rootTenant.roleId,
					},
				});
				createdCount++;
			} else {
				skippedCount++;
			}
		}
	}

	console.log(
		`계층적 Tenant 생성 완료! (생성: ${createdCount}개, 스킵: ${skippedCount}개)`,
	);
}

const spaceGroupSeed: Array<{ name: string; label: string; spaceId: string }> =
	[
		{
			name: "TEAM_TRAINING",
			label: "",
			spaceId: "",
		},
		{
			name: "PERSONAL_TRAINNING",
			label: "",
			spaceId: "",
		},
		{
			name: "GROUND",
			label: "",
			spaceId: "",
		},
		{
			name: "PILATES",
			label: "",
			spaceId: "",
		},
	];

// ============================================================================
// Asset Domain Seed Data Creation Functions
// ============================================================================

async function createAssetDomainData() {
	console.log("\n========================================");
	console.log("Asset Domain 시드 데이터 삽입 중...");
	console.log("========================================");

	// System Space 조회
	const systemSpace = await prisma.space.findFirst({
		where: {
			classification: {
				category: { name: "루트" },
			},
		},
	});

	if (!systemSpace) {
		console.error("System Space를 찾을 수 없습니다. Asset 시드를 건너뜁니다.");
		return;
	}

	// Admin 유저 조회 (creator로 사용)
	const adminUser = await prisma.user.findFirst({
		where: { email: "admin@plate.com" },
	});

	// 1. Folder 생성
	console.log("\n[1/6] Folder 생성 중...");
	const folderByPath = new Map<string, { id: string }>();
	let folderCreated = 0;
	let folderSkipped = 0;

	for (const folderData of folderSeedData) {
		const existing = await prisma.folder.findUnique({
			where: { path: folderData.path },
		});

		if (!existing) {
			// parentFolderId 찾기
			let parentFolderId: string | undefined;
			if (folderData.parentFolderPath) {
				const parentFolder = folderByPath.get(folderData.parentFolderPath);
				if (parentFolder) {
					parentFolderId = parentFolder.id;
				}
			}

			const folder = await prisma.folder.create({
				data: {
					spaceId: systemSpace.id,
					name: folderData.name,
					path: folderData.path,
					parentFolderId,
					sortOrder: folderData.sortOrder,
					creatorId: adminUser?.id,
				},
			});
			folderByPath.set(folderData.path, { id: folder.id });
			folderCreated++;
			console.log(`  - Folder 생성: ${folderData.path}`);
		} else {
			folderByPath.set(folderData.path, { id: existing.id });
			folderSkipped++;
		}
	}
	console.log(`Folder 완료! (생성: ${folderCreated}개, 스킵: ${folderSkipped}개)`);

	// 2. Asset 생성 (CTI 부모)
	console.log("\n[2/6] Asset 생성 중...");
	const assetByStorageKey = new Map<string, { id: string; kind: string }>();
	let assetCreated = 0;
	let assetSkipped = 0;

	for (const assetData of assetSeedData) {
		const existing = await prisma.asset.findUnique({
			where: { storageKey: assetData.storageKey },
		});

		if (!existing) {
			// folderId 찾기
			const folder = folderByPath.get(assetData.folderPath);
			if (!folder) {
				console.warn(`  - Folder를 찾을 수 없음: ${assetData.folderPath}`);
				continue;
			}

			// creatorId 찾기
			let creatorId: string | undefined;
			if (assetData.creatorEmail) {
				const creator = await prisma.user.findFirst({
					where: { email: assetData.creatorEmail },
				});
				creatorId = creator?.id;
			}

			const asset = await prisma.asset.create({
				data: {
					spaceId: systemSpace.id,
					folderId: folder.id,
					kind: assetData.kind as "IMAGE" | "VIDEO" | "DOCUMENT",
					status: "READY",
					originalName: assetData.originalName,
					storageKey: assetData.storageKey,
					mimeType: assetData.mimeType,
					extension: assetData.extension,
					sizeBytes: BigInt(assetData.sizeBytes),
					checksum: assetData.checksum,
					metadata: assetData.metadata
						? (assetData.metadata as unknown as Prisma.InputJsonObject)
						: undefined,
					creatorId,
				},
			});
			assetByStorageKey.set(assetData.storageKey, {
				id: asset.id,
				kind: assetData.kind,
			});
			assetCreated++;
			console.log(`  - Asset 생성: ${assetData.originalName} (${assetData.kind})`);
		} else {
			assetByStorageKey.set(assetData.storageKey, {
				id: existing.id,
				kind: existing.kind,
			});
			assetSkipped++;
		}
	}
	console.log(`Asset 완료! (생성: ${assetCreated}개, 스킵: ${assetSkipped}개)`);

	// 3. Image Detail 생성 (IMAGE 타입)
	console.log("\n[3/6] Image Detail 생성 중...");
	let imageCreated = 0;
	let imageSkipped = 0;

	for (const imageData of imageDetailSeedData) {
		const asset = assetByStorageKey.get(imageData.storageKey);
		if (!asset || asset.kind !== "IMAGE") {
			continue;
		}

		const existing = await prisma.image.findUnique({
			where: { assetId: asset.id },
		});

		if (!existing) {
			await prisma.image.create({
				data: {
					assetId: asset.id,
					width: imageData.width,
					height: imageData.height,
					orientation: imageData.orientation,
					colorSpace: imageData.colorSpace,
					hasAlpha: imageData.hasAlpha,
				},
			});
			imageCreated++;
		} else {
			imageSkipped++;
		}
	}
	console.log(`Image Detail 완료! (생성: ${imageCreated}개, 스킵: ${imageSkipped}개)`);

	// 4. Video Detail 생성 (VIDEO 타입)
	console.log("\n[4/6] Video Detail 생성 중...");
	let videoCreated = 0;
	let videoSkipped = 0;

	for (const videoData of videoDetailSeedData) {
		const asset = assetByStorageKey.get(videoData.storageKey);
		if (!asset || asset.kind !== "VIDEO") {
			continue;
		}

		const existing = await prisma.video.findUnique({
			where: { assetId: asset.id },
		});

		if (!existing) {
			await prisma.video.create({
				data: {
					assetId: asset.id,
					width: videoData.width,
					height: videoData.height,
					durationMs: videoData.durationMs,
					frameRate: videoData.frameRate,
					codec: videoData.codec,
					bitrate: videoData.bitrate,
					hasAudio: videoData.hasAudio,
				},
			});
			videoCreated++;
		} else {
			videoSkipped++;
		}
	}
	console.log(`Video Detail 완료! (생성: ${videoCreated}개, 스킵: ${videoSkipped}개)`);

	// 5. Document Detail 생성 (DOCUMENT 타입)
	console.log("\n[5/6] Document Detail 생성 중...");
	let documentCreated = 0;
	let documentSkipped = 0;

	for (const docData of documentDetailSeedData) {
		const asset = assetByStorageKey.get(docData.storageKey);
		if (!asset || asset.kind !== "DOCUMENT") {
			continue;
		}

		const existing = await prisma.document.findUnique({
			where: { assetId: asset.id },
		});

		if (!existing) {
			await prisma.document.create({
				data: {
					assetId: asset.id,
					pageCount: docData.pageCount,
					wordCount: docData.wordCount,
					author: docData.author,
					title: docData.title,
					subject: docData.subject,
					keywords: docData.keywords,
				},
			});
			documentCreated++;
		} else {
			documentSkipped++;
		}
	}
	console.log(`Document Detail 완료! (생성: ${documentCreated}개, 스킵: ${documentSkipped}개)`);

	// 6. Derivative 생성
	console.log("\n[6/6] Derivative 생성 중...");
	let derivativeCreated = 0;
	let derivativeSkipped = 0;

	for (const derivativeData of derivativeSeedData) {
		const sourceAsset = assetByStorageKey.get(derivativeData.sourceStorageKey);
		if (!sourceAsset) {
			continue;
		}

		const existing = await prisma.derivative.findUnique({
			where: { storageKey: derivativeData.storageKey },
		});

		if (!existing) {
			await prisma.derivative.create({
				data: {
					spaceId: systemSpace.id,
					assetId: sourceAsset.id,
					kind: derivativeData.kind as
						| "THUMBNAIL"
						| "PREVIEW"
						| "TRANSCODE"
						| "TEXT",
					profile: "default",
					storageKey: derivativeData.storageKey,
					mimeType: derivativeData.mimeType,
					sizeBytes: BigInt(derivativeData.sizeBytes),
					width: derivativeData.width,
					height: derivativeData.height,
					durationMs: derivativeData.durationMs,
				},
			});
			derivativeCreated++;
			console.log(
				`  - Derivative 생성: ${derivativeData.kind} - ${derivativeData.storageKey}`,
			);
		} else {
			derivativeSkipped++;
		}
	}
	console.log(
		`Derivative 완료! (생성: ${derivativeCreated}개, 스킵: ${derivativeSkipped}개)`,
	);

	// 7. Album 생성
	console.log("\n[7/8] Album 생성 중...");
	const albumByName = new Map<string, { id: string }>();
	let albumCreated = 0;
	let albumSkipped = 0;

	for (const albumData of albumSeedData) {
		// coverAssetId 찾기
		let coverAssetId: string | undefined;
		if (albumData.coverStorageKey) {
			const coverAsset = assetByStorageKey.get(albumData.coverStorageKey);
			if (coverAsset) {
				coverAssetId = coverAsset.id;
			}
		}

		// creatorId 찾기
		let creatorId: string | undefined;
		if (albumData.creatorEmail) {
			const creator = await prisma.user.findFirst({
				where: { email: albumData.creatorEmail },
			});
			creatorId = creator?.id;
		}

		const existing = await prisma.album.findFirst({
			where: {
				name: albumData.name,
				spaceId: systemSpace.id,
			},
		});

		if (!existing) {
			const album = await prisma.album.create({
				data: {
					spaceId: systemSpace.id,
					name: albumData.name,
					description: albumData.description,
					coverAssetId,
					sortOrder: albumData.sortOrder,
					creatorId,
				},
			});
			albumByName.set(albumData.name, { id: album.id });
			albumCreated++;
			console.log(`  - Album 생성: ${albumData.name}`);
		} else {
			albumByName.set(albumData.name, { id: existing.id });
			albumSkipped++;
		}
	}
	console.log(`Album 완료! (생성: ${albumCreated}개, 스킵: ${albumSkipped}개)`);

	// 8. AlbumEntry 생성
	console.log("\n[8/8] AlbumEntry 생성 중...");
	let entryCreated = 0;
	let entrySkipped = 0;

	for (const entryData of albumEntrySeedData) {
		const album = albumByName.get(entryData.albumName);
		if (!album) {
			continue;
		}

		const asset = assetByStorageKey.get(entryData.assetStorageKey);
		if (!asset) {
			continue;
		}

		const existing = await prisma.albumEntry.findFirst({
			where: {
				albumId: album.id,
				assetId: asset.id,
			},
		});

		if (!existing) {
			await prisma.albumEntry.create({
				data: {
					spaceId: systemSpace.id,
					albumId: album.id,
					assetId: asset.id,
					position: entryData.position,
					caption: entryData.caption,
				},
			});
			entryCreated++;
		} else {
			entrySkipped++;
		}
	}
	console.log(`AlbumEntry 완료! (생성: ${entryCreated}개, 스킵: ${entrySkipped}개)`);

	console.log(
		`\n✅ Asset Domain 시드 완료! Folder(${folderCreated}), Asset(${assetCreated}), Image(${imageCreated}), Video(${videoCreated}), Document(${documentCreated}), Derivative(${derivativeCreated}), Album(${albumCreated}), AlbumEntry(${entryCreated})`,
	);
}

// ============================================================================
// Inquiry Domain Seed Data Creation Functions
// ============================================================================

async function createInquiryDomainData() {
	console.log("\n========================================");
	console.log("Inquiry Domain 시드 데이터 삽입 중...");
	console.log("========================================");

	// 1. User/Ground/Space 맵 조회
	const users = await prisma.user.findMany();
	const grounds = await prisma.ground.findMany();

	const userByEmail = new Map(users.map((u) => [u.email, u]));
	const groundByName = new Map(grounds.map((g) => [g.name, g]));

	// 2. Inquiry 생성
	console.log("\n[1/6] Inquiry 생성 중...");
	const inquiryByNumber = new Map<string, { id: string; spaceId: string }>();
	let inquiryCreated = 0;
	let inquirySkipped = 0;

	for (const inquiryData of inquirySeedData) {
		const existing = await prisma.inquiry.findUnique({
			where: { inquiryNumber: inquiryData.inquiryNumber },
		});

		if (!existing) {
			const ground = groundByName.get(inquiryData.groundName);
			if (!ground) {
				console.warn(
					`  - Ground를 찾을 수 없음: ${inquiryData.groundName}`,
				);
				continue;
			}

			const customer = userByEmail.get(inquiryData.customerEmail);
			const assignee = inquiryData.assigneeEmail
				? userByEmail.get(inquiryData.assigneeEmail)
				: null;

			// SLA 기한 설정 (생성 후 24시간 응답, 72시간 해결)
			const now = new Date();
			const slaResponseDue = new Date(now.getTime() + 24 * 60 * 60 * 1000);
			const slaResolveDue = new Date(now.getTime() + 72 * 60 * 60 * 1000);

			const inquiry = await prisma.inquiry.create({
				data: {
					spaceId: ground.spaceId,
					inquiryNumber: inquiryData.inquiryNumber,
					title: inquiryData.title,
					category: inquiryData.category as
						| "GENERAL"
						| "DELIVERY"
						| "PAYMENT"
						| "REFUND"
						| "PRODUCT"
						| "ACCOUNT"
						| "TECHNICAL"
						| "COMPLAINT"
						| "OTHER",
					channel: inquiryData.channel as
						| "WEB"
						| "EMAIL"
						| "CHAT"
						| "SMS"
						| "PHONE"
						| "WALK_IN",
					source: inquiryData.source as "ONLINE" | "OFFLINE",
					status: inquiryData.status as
						| "NEW"
						| "OPEN"
						| "IN_PROGRESS"
						| "WAITING_CUSTOMER"
						| "RESOLVED"
						| "CLOSED"
						| "ESCALATED",
					priority: inquiryData.priority as
						| "LOW"
						| "NORMAL"
						| "HIGH"
						| "URGENT",
					customerId: customer?.id,
					assigneeId: assignee?.id,
					slaResponseDue,
					slaResolveDue,
					sentiment: inquiryData.sentiment as
						| "POSITIVE"
						| "NEUTRAL"
						| "NEGATIVE"
						| null,
					sentimentScore: inquiryData.sentimentScore,
					aiResolutionAttempted: inquiryData.aiResolutionAttempted ?? false,
					aiResolved: inquiryData.aiResolved ?? false,
					isRealtimeChat: inquiryData.isRealtimeChat ?? false,
				},
			});

			inquiryByNumber.set(inquiryData.inquiryNumber, {
				id: inquiry.id,
				spaceId: inquiry.spaceId,
			});
			inquiryCreated++;
			console.log(`  - Inquiry 생성: ${inquiryData.inquiryNumber}`);
		} else {
			inquiryByNumber.set(inquiryData.inquiryNumber, {
				id: existing.id,
				spaceId: existing.spaceId,
			});
			inquirySkipped++;
		}
	}
	console.log(
		`Inquiry 완료! (생성: ${inquiryCreated}개, 스킵: ${inquirySkipped}개)`,
	);

	// 3. InquiryThread 생성
	console.log("\n[2/6] InquiryThread 생성 중...");
	const threadByInquiryNumber = new Map<string, { id: string }[]>();
	let threadCreated = 0;
	let threadSkipped = 0;

	for (const threadData of inquiryThreadSeedData) {
		const inquiryInfo = inquiryByNumber.get(threadData.inquiryNumber);
		if (!inquiryInfo) continue;

		const creator = userByEmail.get(threadData.creatorEmail);
		if (!creator) continue;

		const existing = await prisma.inquiryThread.findFirst({
			where: {
				inquiryId: inquiryInfo.id,
				createdBy: creator.id,
			},
		});

		if (!existing) {
			const thread = await prisma.inquiryThread.create({
				data: {
					inquiryId: inquiryInfo.id,
					title: threadData.title,
					status: threadData.status as "ACTIVE" | "RESOLVED" | "CLOSED",
					createdBy: creator.id,
				},
			});

			if (!threadByInquiryNumber.has(threadData.inquiryNumber)) {
				threadByInquiryNumber.set(threadData.inquiryNumber, []);
			}
			threadByInquiryNumber.get(threadData.inquiryNumber)!.push({
				id: thread.id,
			});
			threadCreated++;
		} else {
			if (!threadByInquiryNumber.has(threadData.inquiryNumber)) {
				threadByInquiryNumber.set(threadData.inquiryNumber, []);
			}
			threadByInquiryNumber.get(threadData.inquiryNumber)!.push({
				id: existing.id,
			});
			threadSkipped++;
		}
	}
	console.log(
		`InquiryThread 완료! (생성: ${threadCreated}개, 스킵: ${threadSkipped}개)`,
	);

	// 4. InquiryMessage 생성
	console.log("\n[3/6] InquiryMessage 생성 중...");
	let messageCreated = 0;
	let messageSkipped = 0;

	for (const messageData of inquiryMessageSeedData) {
		const inquiryInfo = inquiryByNumber.get(messageData.inquiryNumber);
		if (!inquiryInfo) continue;

		const threads = threadByInquiryNumber.get(messageData.inquiryNumber);
		if (!threads || threads.length === 0) continue;

		const threadIndex = Math.min(
			messageData.threadIndex,
			threads.length - 1,
		);
		const threadId = threads[threadIndex].id;

		const sender = messageData.senderEmail
			? userByEmail.get(messageData.senderEmail)
			: null;

		const existing = await prisma.inquiryMessage.findFirst({
			where: {
				threadId,
				content: messageData.content,
			},
		});

		if (!existing) {
			await prisma.inquiryMessage.create({
				data: {
					threadId,
					inquiryId: inquiryInfo.id,
					senderId: sender?.id,
					senderType: messageData.senderType as
						| "USER"
						| "AI"
						| "SYSTEM",
					content: messageData.content,
					contentType: messageData.contentType as
						| "TEXT"
						| "HTML"
						| "MARKDOWN"
						| "IMAGE"
						| "FILE"
						| "SYSTEM",
					isEdited: messageData.isEdited ?? false,
				},
			});
			messageCreated++;
		} else {
			messageSkipped++;
		}
	}
	console.log(
		`InquiryMessage 완료! (생성: ${messageCreated}개, 스킵: ${messageSkipped}개)`,
	);

	// 5. InquiryParticipant 생성
	console.log("\n[4/6] InquiryParticipant 생성 중...");
	let participantCreated = 0;
	let participantSkipped = 0;

	for (const participantData of inquiryParticipantSeedData) {
		const inquiryInfo = inquiryByNumber.get(participantData.inquiryNumber);
		if (!inquiryInfo) continue;

		const user = userByEmail.get(participantData.userEmail);
		if (!user) continue;

		let threadId: string | undefined;
		if (participantData.threadIndex !== undefined) {
			const threads = threadByInquiryNumber.get(participantData.inquiryNumber);
			if (threads && threads.length > 0) {
				const threadIndex = Math.min(
					participantData.threadIndex,
					threads.length - 1,
				);
				threadId = threads[threadIndex].id;
			}
		}

		const existing = await prisma.inquiryParticipant.findFirst({
			where: {
				inquiryId: inquiryInfo.id,
				threadId: threadId ?? null,
				userId: user.id,
			},
		});

		if (!existing) {
			await prisma.inquiryParticipant.create({
				data: {
					inquiryId: inquiryInfo.id,
					threadId,
					userId: user.id,
					role: participantData.role as
						| "CUSTOMER"
						| "AGENT"
						| "SUPERVISOR"
						| "VIEWER",
					isOnline: participantData.isOnline ?? false,
				},
			});
			participantCreated++;
		} else {
			participantSkipped++;
		}
	}
	console.log(
		`InquiryParticipant 완료! (생성: ${participantCreated}개, 스킵: ${participantSkipped}개)`,
	);

	// 6. InquiryTag 생성
	console.log("\n[5/6] InquiryTag 생성 중...");
	let tagCreated = 0;
	let tagSkipped = 0;

	for (const inquiryData of inquirySeedData) {
		const inquiryInfo = inquiryByNumber.get(inquiryData.inquiryNumber);
		if (!inquiryInfo) continue;

		for (const tagName of inquiryData.tags) {
			const tagMaster = inquiryTagMasterData.find(
				(t) => t.name === tagName,
			);

			const existing = await prisma.inquiryTag.findFirst({
				where: {
					inquiryId: inquiryInfo.id,
					name: tagName,
				},
			});

			if (!existing) {
				await prisma.inquiryTag.create({
					data: {
						inquiryId: inquiryInfo.id,
						name: tagName,
						color: tagMaster?.color,
					},
				});
				tagCreated++;
			} else {
				tagSkipped++;
			}
		}
	}
	console.log(
		`InquiryTag 완료! (생성: ${tagCreated}개, 스킵: ${tagSkipped}개)`,
	);

	// 7. SentimentAnalysis 생성
	console.log("\n[6/6] SentimentAnalysis 생성 중...");
	let sentimentCreated = 0;
	let sentimentSkipped = 0;

	for (const sentimentData of sentimentAnalysisSeedData) {
		const inquiryInfo = inquiryByNumber.get(sentimentData.inquiryNumber);
		if (!inquiryInfo) continue;

		const existing = await prisma.sentimentAnalysis.findUnique({
			where: { inquiryId: inquiryInfo.id },
		});

		if (!existing) {
			await prisma.sentimentAnalysis.create({
				data: {
					inquiryId: inquiryInfo.id,
					sentiment: sentimentData.sentiment as
						| "POSITIVE"
						| "NEUTRAL"
						| "NEGATIVE",
					score: sentimentData.score,
					confidence: sentimentData.confidence,
					emotions: sentimentData.emotions
						? (sentimentData.emotions as unknown as Prisma.InputJsonObject)
						: undefined,
					keywords: sentimentData.keywords
						? (sentimentData.keywords as unknown as Prisma.InputJsonValue)
						: undefined,
					urgency: sentimentData.urgency,
				},
			});
			sentimentCreated++;
		} else {
			sentimentSkipped++;
		}
	}
	console.log(
		`SentimentAnalysis 완료! (생성: ${sentimentCreated}개, 스킵: ${sentimentSkipped}개)`,
	);

	console.log(
		`\n✅ Inquiry Domain 시드 완료! Inquiry(${inquiryCreated}), Thread(${threadCreated}), Message(${messageCreated}), Participant(${participantCreated}), Tag(${tagCreated}), SentimentAnalysis(${sentimentCreated})`,
	);
}
