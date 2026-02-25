import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { config } from "dotenv";

// Load .env.local from packages/prisma directory
config({ path: resolve(__dirname, ".env.local") });

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt";
import * as pg from "pg";

/** System Space 고정 UUID (E2E 테스트와 일치해야 함) */
const SYSTEM_SPACE_ID = "61ddca20-1752-466e-b4da-879ebdbe54e3";
import {
	abilitySeedData,
	actionSeedData,
	exerciseCatalogSeedData,
	groundSeedData,
	oidcClientSeedData,
	roleAssociationSeedData,
	roleCategorySeedData,
	roleClassificationSeedData,
	roleGroupSeedData,
	roleSeedData,
	securityPolicySeedData,
	sessionLoadProfileSeedData,
	sessionTemplateSeedData,
	spaceCategorySeedData,
	spaceGroupSeedData,
	subjectSeedData,
	templateSeedData,
	timelineSeedData,
	translationSeedData,
	userGroundMapping,
	userSeedData,

	// Asset Domain
	albumSeedData,
	albumEntrySeedData,
	assetSeedData,
	derivativeSeedData,
	documentDetailSeedData,
	folderSeedData,
	imageDetailSeedData,
	videoDetailSeedData,
} from "./seed-data";
import type {
	Action,
	Ground,
	Group,
	Role,
	Subject,
} from "./src/generated/client/client";
import { Prisma, PrismaClient } from "./src/generated/client/client";
import {
	CategoryTypes,
	RecurringDayOfWeek,
	RepeatCycleTypes,
	SessionTypes,
} from "./src/generated/client/enums";

// Prisma 7: Adapter 패턴으로 PrismaClient 생성
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
	// Super Admin 데이터를 seed-data에서 가져오기
	const superAdminData = userSeedData.find((u) => u.role === "FULL_ACCESS");
	if (!superAdminData)
		throw new Error("FULL_ACCESS 유저 데이터가 seed-data에 없습니다.");

	const hashedPassword = await hash(superAdminData.password, 10);

	// Role들을 seed-data.ts 기반으로 생성
	const roles: Record<string, Role> = {};
	for (const roleData of roleSeedData) {
		roles[roleData.name] = await prisma.role.upsert({
			where: { name: roleData.name },
			update: {
				displayName: roleData.displayName,
				description: roleData.description,
				isSystem: roleData.isSystem,
			},
			create: {
				name: roleData.name,
				displayName: roleData.displayName,
				description: roleData.description,
				isSystem: roleData.isSystem,
			},
		});
		console.log(`Role 생성 완료: ${roleData.name}`);
	}

	// Super Admin 유저 생성 (seed-data 기반)
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

	// System Space 생성 (고정 UUID 사용 - E2E 테스트와 일치)
	// SpaceClassification을 통해 ROOT Category가 연결된 Space가 System Space
	const systemSpace = await prisma.space.upsert({
		where: { id: SYSTEM_SPACE_ID },
		update: {},
		create: {
			id: SYSTEM_SPACE_ID,
		},
	});

	// System Space에 Tenant가 없으면 생성 (FULL_ACCESS 전용)
	const existingTenant = await prisma.tenant.findFirst({
		where: {
			spaceId: systemSpace.id,
			roleId: roles.FULL_ACCESS.id,
		},
	});

	if (!existingTenant) {
		await prisma.tenant.create({
			data: {
				userId: superAdminUser.id,
				spaceId: systemSpace.id,
				roleId: roles.FULL_ACCESS.id,
			},
		});
		console.log("System Space Tenant 생성 완료 (FULL_ACCESS 전용)");
	}

	console.log(`System Space 준비 완료 (id=${systemSpace.id})`);

	// Space Category/Group 생성 및 System Space 연결
	await createSpaceCategoriesAndClassifications(systemSpace.id);
	await createSpaceGroupsAndAssociations(systemSpace.id);

	// System Space Ground 생성 (seed-data 기반)
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
				spaceId: systemSpace.id,
			},
		});
		console.log(`System Ground 생성 완료: ${systemGroundData.name}`);
	}

	// Group 생성을 위한 tenant 조회 (System Space의 첫 번째 tenant)
	const firstTenant = await prisma.tenant.findFirst({
		where: { spaceId: systemSpace.id },
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

	// Role 타입 카테고리 생성
	await createRoleCategories(systemSpace.id);

	// Role과 Category 연결 (RoleClassification)
	await createRoleClassifications(roles);

	// Role 관련 Group 생성 및 RoleAssociation 연결
	await createRoleGroupsAndAssociations(roles, systemSpace.id);

	// 일반 유저들과 그라운드 생성
	await createRegularUsersAndGrounds(roles.MANAGE, roles.VIEW);

	// Ground Space에 BRANCH SpaceClassification 할당
	await classifyGroundSpacesAsBranch(systemSpace.id);

	// 상위 SpaceCategory(ROOT) tenant → 하위 SpaceCategory(BRANCH) Space에 tenant 생성
	await createHierarchicalTenants(systemSpace.id);

	// Timeline / Session / Exercise 도메인 데이터 생성
	await createTimelineSessionExerciseDomainData();

	// Subject 생성 (CASL Subject 정의)
	const subjects = await createSubjects();

	// Action 생성 (CASL Action 정의)
	const actions = await createActions();

	// Ability 생성 (Role별 권한) - CASL ABAC 기반
	await createAbilities(roles, subjects, actions);

	// OIDC Client 생성
	await createOidcClients();

	// Asset Domain 데이터 생성
	await createAssetDomainData();

	// Template 생성
	await createTemplates();

	console.log({ superAdminUser });
}

async function createRegularUsersAndGrounds(adminRole: Role, _userRole: Role) {
	console.log("일반 유저들과 그라운드 생성 시작...");

	// 모든 Role 조회 (seed-data의 role 필드 사용을 위해)
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

async function createRoleCategories(systemSpaceId: string) {
	console.log("Role 카테고리 생성 시작...");

	// System Space의 tenant 조회
	const tenant = await prisma.tenant.findFirst({
		where: { spaceId: systemSpaceId },
	});

	if (!tenant) {
		console.error("System Space의 tenant를 찾을 수 없습니다.");
		return;
	}

	// seed-data.ts의 roleCategorySeedData 기반으로 카테고리 생성
	for (const categoryData of roleCategorySeedData) {
		const roleCategoryEnum = categoryData.roleCategoryEnum;

		const _category = await prisma.category.upsert({
			where: { name: roleCategoryEnum.name },
			update: {},
			create: {
				name: roleCategoryEnum.name, // enum의 name 속성 사용
				type: categoryData.type as CategoryTypes,
				spaceId: tenant.spaceId,
			},
		});
		console.log(
			`카테고리 생성 완료: ${roleCategoryEnum.code} - ${roleCategoryEnum.name}`,
		);
	}

	console.log("Role 카테고리 생성 완료!");
}

async function createRoleClassifications(roles: Record<string, Role>) {
	console.log("Role과 Category 연결 (RoleClassification) 시작...");

	for (const classificationData of roleClassificationSeedData) {
		// 해당 Role 찾기
		const role = roles[classificationData.roleName];
		if (!role) {
			console.error(`Role을 찾을 수 없습니다: ${classificationData.roleName}`);
			continue;
		}

		// 해당 Category 찾기 (name unique 기반)
		const roleCategoryEnum = classificationData.roleCategoryEnum;
		const category = await prisma.category.findUnique({
			where: {
				name: roleCategoryEnum.name,
			},
		});

		if (!category) {
			console.error(
				`Category를 찾을 수 없습니다: ${roleCategoryEnum.code} - ${roleCategoryEnum.name}`,
			);
			continue;
		}

		// RoleClassification 생성 (중복 확인)
		const existingRoleClassification =
			await prisma.roleClassification.findFirst({
				where: {
					roleId: role.id,
					categoryId: category.id,
				},
			});

		if (!existingRoleClassification) {
			await prisma.roleClassification.create({
				data: {
					roleId: role.id,
					categoryId: category.id,
				},
			});
			console.log(
				`RoleClassification 생성: ${classificationData.roleName} ↔ ${roleCategoryEnum.code}`,
			);
		} else {
			console.log(
				`RoleClassification 이미 존재: ${classificationData.roleName} ↔ ${roleCategoryEnum.code}`,
			);
		}
	}

	console.log("Role과 Category 연결 완료!");
}

async function createRoleGroupsAndAssociations(
	roles: Record<string, Role>,
	systemSpaceId: string,
) {
	console.log("Role 관련 Group 생성 및 RoleAssociation 연결 시작...");

	// System Space의 tenant 조회 (Group 생성에 필요)
	const tenant = await prisma.tenant.findFirst({
		where: { spaceId: systemSpaceId },
	});

	if (!tenant) {
		console.error("System Space의 tenant를 찾을 수 없습니다.");
		return;
	}

	// Role용 Group들 생성 (RoleGroupSeedData 기반)
	const groups: Record<string, Group> = {};
	for (const groupData of roleGroupSeedData) {
		const roleGroupEnum = groupData.roleGroupEnum;

		// 기존 Group이 있는지 확인
		let group = await prisma.group.findFirst({
			where: {
				name: roleGroupEnum.name, // enum의 name 속성 사용
				type: "Role",
				spaceId: tenant.spaceId,
			},
		});

		if (!group) {
			group = await prisma.group.create({
				data: {
					name: roleGroupEnum.name, // enum의 name 속성 사용
					type: "Role", // GroupTypes.Role
					spaceId: tenant.spaceId,
				},
			});
			console.log(
				`Role Group 생성 완료: ${roleGroupEnum.code} - ${roleGroupEnum.name}`,
			);
		} else {
			console.log(
				`Role Group 이미 존재: ${roleGroupEnum.code} - ${roleGroupEnum.name}`,
			);
		}

		groups[roleGroupEnum.code] = group; // enum의 code로 키 설정
	}

	// RoleAssociation 생성 (Role과 Group 연결)
	for (const associationData of roleAssociationSeedData) {
		const role = roles[associationData.roleName];
		const group = groups[associationData.roleGroupEnum.code]; // enum의 code 사용

		if (!role) {
			console.error(`Role을 찾을 수 없습니다: ${associationData.roleName}`);
			continue;
		}

		if (!group) {
			console.error(
				`Group을 찾을 수 없습니다: ${associationData.roleGroupEnum.code}`,
			);
			continue;
		}

		// RoleAssociation 생성 (중복 확인)
		const existingAssociation = await prisma.roleAssociation.findFirst({
			where: {
				roleId: role.id,
				groupId: group.id,
			},
		});

		if (!existingAssociation) {
			await prisma.roleAssociation.create({
				data: {
					roleId: role.id,
					groupId: group.id,
				},
			});
			console.log(
				`RoleAssociation 생성: ${associationData.roleName} ↔ ${associationData.roleGroupEnum.code}`,
			);
		} else {
			console.log(
				`RoleAssociation 이미 존재: ${associationData.roleName} ↔ ${associationData.roleGroupEnum.code}`,
			);
		}
	}

	console.log("Role 관련 Group 생성 및 RoleAssociation 연결 완료!");
}

async function createSubjects(): Promise<Record<string, Subject>> {
	console.log("Subject 생성 시작...");

	const subjects: Record<string, Subject> = {};
	let createdCount = 0;
	let skippedCount = 0;

	for (const subjectData of subjectSeedData) {
		const existing = await prisma.subject.findUnique({
			where: { name: subjectData.name },
		});

		if (!existing) {
			const subject = await prisma.subject.create({
				data: {
					name: subjectData.name,
					displayName: subjectData.displayName,
					group: subjectData.group,
					order: subjectData.order ?? 0,
					isSystem: subjectData.isSystem ?? false,
				},
			});
			subjects[subjectData.name] = subject;
			createdCount++;
			console.log(
				`  - Subject 생성: ${subjectData.name} (${subjectData.displayName})`,
			);
		} else {
			subjects[subjectData.name] = existing;
			skippedCount++;
		}
	}

	console.log(
		`Subject 생성 완료! (생성: ${createdCount}개, 스킵: ${skippedCount}개)`,
	);
	return subjects;
}

async function createActions(): Promise<Record<string, Action>> {
	console.log("Action 생성 시작...");

	const actions: Record<string, Action> = {};
	let createdCount = 0;
	let skippedCount = 0;

	for (const actionData of actionSeedData) {
		const existing = await prisma.action.findUnique({
			where: { name: actionData.name },
		});

		if (!existing) {
			const action = await prisma.action.create({
				data: {
					name: actionData.name,
					displayName: actionData.displayName,
					description: actionData.description,
					group: actionData.group,
					order: actionData.order ?? 0,
					isSystem: actionData.isSystem ?? true,
					config: actionData.config
						? (actionData.config as unknown as Prisma.InputJsonObject)
						: undefined,
				},
			});
			actions[actionData.name] = action;
			createdCount++;
			console.log(
				`  - Action 생성: ${actionData.name} (${actionData.displayName})`,
			);
		} else {
			actions[actionData.name] = existing;
			skippedCount++;
		}
	}

	console.log(
		`Action 생성 완료! (생성: ${createdCount}개, 스킵: ${skippedCount}개)`,
	);
	return actions;
}

async function createAbilities(
	roles: Record<string, Role>,
	subjects: Record<string, Subject>,
	actions: Record<string, Action>,
) {
	console.log("Ability & Grant 생성 시작 (Grant 기반 CASL ABAC)...");

	let abilityCreatedCount = 0;
	let abilitySkippedCount = 0;
	let grantCreatedCount = 0;
	let grantSkippedCount = 0;
	let errorCount = 0;

	// 1단계: 고유한 Ability 정의 생성 (중복 제거)
	console.log("  [1/2] Ability 정의 생성 중...");
	const abilityMap: Record<string, string> = {}; // Key: subject+action+inverted → Value: abilityId

	for (const abilityData of abilitySeedData) {
		// Subject 찾기
		const subject = subjects[abilityData.subject];
		if (!subject) {
			console.error(`  - Subject를 찾을 수 없음: ${abilityData.subject}`);
			errorCount++;
			continue;
		}

		// Action 찾기
		const action = actions[abilityData.actionName];
		if (!action) {
			console.error(`  - Action을 찾을 수 없음: ${abilityData.actionName}`);
			errorCount++;
			continue;
		}

		// Ability 고유 키 생성 (subject + action + inverted + conditions)
		const abilityKey = `${subject.id}:${action.id}:${abilityData.inverted}:${JSON.stringify(abilityData.conditions ?? null)}`;

		// 이미 생성된 Ability인지 확인
		if (abilityMap[abilityKey]) {
			continue; // 이미 생성됨
		}

		// Ability name 생성 (예: "Read User Email Masked")
		const abilityName =
			abilityData.name ??
			`${abilityData.inverted ? "Cannot" : "Can"} ${action.displayName} ${subject.displayName}`;

		// Ability 생성 (name 기반 중복 확인)
		let ability = await prisma.ability.findUnique({
			where: { name: abilityName },
		});

		if (!ability) {
			ability = await prisma.ability.create({
				data: {
					name: abilityName,
					description: abilityData.description,
					subjectId: subject.id,
					actionId: action.id,
					fields: [], // 기본값: 빈 배열 (전체 필드)
					conditions: abilityData.conditions
						? (abilityData.conditions as unknown as Prisma.InputJsonObject)
						: Prisma.JsonNull,
					inverted: abilityData.inverted,
					reason: abilityData.reason ?? null,
				},
			});
			abilityCreatedCount++;
			console.log(`    - Ability 생성: ${abilityName}`);
		} else {
			abilitySkippedCount++;
		}

		abilityMap[abilityKey] = ability.id;
	}

	console.log(
		`  [1/2] Ability 정의 완료! (생성: ${abilityCreatedCount}개, 스킵: ${abilitySkippedCount}개)`,
	);

	// 2단계: Grant 생성 (Role ↔ Ability 연결)
	console.log("  [2/2] Grant 생성 중 (Role ↔ Ability)...");

	for (const abilityData of abilitySeedData) {
		// Role 찾기
		const role = roles[abilityData.roleName];
		if (!role) {
			console.error(`  - Role을 찾을 수 없음: ${abilityData.roleName}`);
			errorCount++;
			continue;
		}

		// Subject, Action 찾기
		const subject = subjects[abilityData.subject];
		const action = actions[abilityData.actionName];
		if (!subject || !action) {
			continue; // 이미 1단계에서 에러 출력됨
		}

		// Ability 찾기
		const abilityKey = `${subject.id}:${action.id}:${abilityData.inverted}:${JSON.stringify(abilityData.conditions ?? null)}`;
		const abilityId = abilityMap[abilityKey];
		if (!abilityId) {
			console.error(`  - Ability를 찾을 수 없음: ${abilityKey}`);
			errorCount++;
			continue;
		}

		// Grant 중복 확인
		const existing = await prisma.grant.findFirst({
			where: {
				granteeType: "Role",
				granteeId: role.id,
				abilityId: abilityId,
			},
		});

		if (!existing) {
			await prisma.grant.create({
				data: {
					granteeType: "Role",
					granteeId: role.id,
					abilityId: abilityId,
					isActive: abilityData.isActive ?? true,
					priority: abilityData.priority ?? 0, // Role 권한은 보통 0-9
				},
			});
			grantCreatedCount++;
			console.log(
				`    - Grant 생성: ${abilityData.roleName} → ${abilityData.inverted ? "cannot" : "can"} ${abilityData.actionName} ${abilityData.subject}`,
			);
		} else {
			grantSkippedCount++;
		}
	}

	console.log(
		`  [2/2] Grant 생성 완료! (생성: ${grantCreatedCount}개, 스킵: ${grantSkippedCount}개)`,
	);
	console.log(
		`\n✅ Ability & Grant 전체 완료! (Ability: ${abilityCreatedCount}개, Grant: ${grantCreatedCount}개, 오류: ${errorCount}개)`,
	);

	// ========================================
	// 7. Translation 시드 데이터 삽입
	// ========================================
	console.log("\n========================================");
	console.log("7. Translation (번역) 시드 데이터 삽입 중...");
	console.log("========================================");

	let translationCreatedCount = 0;
	let translationSkippedCount = 0;

	for (const translation of translationSeedData) {
		const existing = await prisma.translation.findUnique({
			where: {
				languageCode_key: {
					languageCode: translation.languageCode,
					key: translation.key,
				},
			},
		});

		if (!existing) {
			await prisma.translation.create({
				data: translation,
			});
			translationCreatedCount++;
		} else {
			translationSkippedCount++;
		}
	}

	console.log(
		`✅ Translation 시드 완료! (생성: ${translationCreatedCount}개, 스킵: ${translationSkippedCount}개)`,
	);

	// ============================================================================
	// Security Policy 시드
	// ============================================================================
	const existingPolicy = await prisma.securityPolicy.findUnique({
		where: { key: securityPolicySeedData.key },
	});

	if (!existingPolicy) {
		await prisma.securityPolicy.create({
			data: securityPolicySeedData,
		});
		console.log("✅ SecurityPolicy 기본 정책 생성 완료!");
	} else {
		console.log("⏭️ SecurityPolicy 기본 정책 이미 존재 (스킵)");
	}
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

async function createOidcClients() {
	console.log("\n========================================");
	console.log("OIDC Client 시드 데이터 삽입 중...");
	console.log("========================================");

	let createdCount = 0;
	let skippedCount = 0;

	for (const clientData of oidcClientSeedData) {
		const existing = await prisma.oidcClient.findUnique({
			where: { clientId: clientData.clientId },
		});

		if (!existing) {
			await prisma.oidcClient.create({
				data: {
					clientId: clientData.clientId,
					clientSecret: clientData.clientSecret,
					clientName: clientData.clientName,
					redirectUris: clientData.redirectUris,
					grantTypes: clientData.grantTypes,
					responseTypes: clientData.responseTypes,
					tokenEndpointAuthMethod: clientData.tokenEndpointAuthMethod,
					scope: clientData.scope,
					isActive: clientData.isActive,
					logoUri: clientData.logoUri ?? null,
					policyUri: clientData.policyUri ?? null,
					tosUri: clientData.tosUri ?? null,
				},
			});
			createdCount++;
			console.log(
				`  - OIDC Client 생성: ${clientData.clientId} (${clientData.clientName})`,
			);
		} else {
			skippedCount++;
			console.log(`  - OIDC Client 이미 존재: ${clientData.clientId}`);
		}
	}

	console.log(
		`✅ OIDC Client 시드 완료! (생성: ${createdCount}개, 스킵: ${skippedCount}개)`,
	);
}

async function createTemplates() {
	console.log("\n========================================");
	console.log("Template 시드 데이터 삽입 중...");
	console.log("========================================");

	let createdCount = 0;
	let skippedCount = 0;

	for (const templateData of templateSeedData) {
		const existing = await prisma.template.findFirst({
			where: {
				code: templateData.code,
				type: templateData.type,
			},
		});

		if (!existing) {
			await prisma.template.create({
				data: {
					code: templateData.code,
					name: templateData.name,
					type: templateData.type,
					subject: templateData.subject ?? null,
					content: templateData.content,
					description: templateData.description ?? null,
					isActive: templateData.isActive,
					variables: {
						create: templateData.variables.map((v) => ({
							name: v.name,
							description: v.description ?? null,
							defaultValue: v.defaultValue ?? null,
							isRequired: v.isRequired,
						})),
					},
				},
			});
			createdCount++;
			console.log(
				`  - Template 생성: ${templateData.code} (${templateData.name})`,
			);
		} else {
			skippedCount++;
			console.log(`  - Template 이미 존재: ${templateData.code}`);
		}
	}

	console.log(
		`✅ Template 시드 완료! (생성: ${createdCount}개, 스킵: ${skippedCount}개)`,
	);
}

async function createSpaceCategoriesAndClassifications(systemSpaceId: string) {
	console.log("Space Category 및 SpaceClassification 생성 시작...");

	// 생성된 Category를 code로 추적 (parentId 연결용)
	const categoryMap: Record<string, { id: string }> = {};

	for (const categoryData of spaceCategorySeedData) {
		const spaceCategoryEnum = categoryData.spaceCategoryEnum;

		// parentId 결정
		let parentId: string | undefined;
		if (categoryData.parentCategoryCode) {
			const parentCategory = categoryMap[categoryData.parentCategoryCode];
			if (parentCategory) {
				parentId = parentCategory.id;
			}
		}

		// Category 생성 (type="Space")
		const category = await prisma.category.upsert({
			where: { name: spaceCategoryEnum.name },
			update: { parentId: parentId ?? null },
			create: {
				name: spaceCategoryEnum.name,
				type: categoryData.type as CategoryTypes,
				spaceId: systemSpaceId,
				parentId: parentId,
			},
		});
		categoryMap[spaceCategoryEnum.code] = { id: category.id };
		console.log(
			`Space Category 생성 완료: ${spaceCategoryEnum.code} - ${spaceCategoryEnum.name}`,
		);
	}

	// SpaceClassification 생성: System Space ↔ ROOT Category 연결
	const rootCategory = categoryMap.ROOT;
	if (rootCategory) {
		const existingClassification = await prisma.spaceClassification.findFirst({
			where: {
				spaceId: systemSpaceId,
				categoryId: rootCategory.id,
			},
		});

		if (!existingClassification) {
			await prisma.spaceClassification.create({
				data: {
					spaceId: systemSpaceId,
					categoryId: rootCategory.id,
				},
			});
			console.log("SpaceClassification 생성: System Space ↔ ROOT");
		} else {
			console.log("SpaceClassification 이미 존재: System Space ↔ ROOT");
		}
	}

	console.log("Space Category 및 SpaceClassification 생성 완료!");
}

async function createSpaceGroupsAndAssociations(systemSpaceId: string) {
	console.log("Space Group 및 SpaceAssociation 생성 시작...");

	for (const groupData of spaceGroupSeedData) {
		const spaceGroupEnum = groupData.spaceGroupEnum;

		// Group 생성 (type="Space")
		let group = await prisma.group.findFirst({
			where: {
				name: spaceGroupEnum.name,
				type: "Space",
				spaceId: systemSpaceId,
			},
		});

		if (!group) {
			group = await prisma.group.create({
				data: {
					name: spaceGroupEnum.name,
					type: "Space",
					spaceId: systemSpaceId,
				},
			});
			console.log(
				`Space Group 생성 완료: ${spaceGroupEnum.code} - ${spaceGroupEnum.name}`,
			);
		} else {
			console.log(
				`Space Group 이미 존재: ${spaceGroupEnum.code} - ${spaceGroupEnum.name}`,
			);
		}

		// SpaceAssociation 생성: System Space ↔ SUPER Group 연결
		const existingAssociation = await prisma.spaceAssociation.findFirst({
			where: {
				spaceId: systemSpaceId,
				groupId: group.id,
			},
		});

		if (!existingAssociation) {
			await prisma.spaceAssociation.create({
				data: {
					spaceId: systemSpaceId,
					groupId: group.id,
				},
			});
			console.log(
				`SpaceAssociation 생성: System Space ↔ ${spaceGroupEnum.code}`,
			);
		} else {
			console.log(
				`SpaceAssociation 이미 존재: System Space ↔ ${spaceGroupEnum.code}`,
			);
		}
	}

	console.log("Space Group 및 SpaceAssociation 생성 완료!");
}

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

		// 이미 SpaceClassification이 존재하는지 확인
		const existing = await prisma.spaceClassification.findFirst({
			where: {
				spaceId: ground.spaceId,
				categoryId: branchCategory.id,
			},
		});

		if (!existing) {
			await prisma.spaceClassification.create({
				data: {
					spaceId: ground.spaceId,
					categoryId: branchCategory.id,
				},
			});
			createdCount++;
			console.log(
				`  - BRANCH 할당: ${ground.name} (spaceId=${ground.spaceId.slice(-8)})`,
			);
		} else {
			skippedCount++;
		}
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
