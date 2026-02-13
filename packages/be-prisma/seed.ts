import { config } from "dotenv";
import { resolve } from "path";
// Load .env.local from packages/prisma directory
config({ path: resolve(__dirname, ".env.local") });

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt";
import * as pg from "pg";
import {
	abilitySeedData,
	actionSeedData,
	groundSeedData,
	oidcClientSeedData,
	roleAssociationSeedData,
	roleCategorySeedData,
	roleClassificationSeedData,
	roleGroupSeedData,
	roleSeedData,
	spaceCategorySeedData,
	spaceGroupSeedData,
	subjectSeedData,
	translationSeedData,
	userGroundMapping,
	userSeedData,
} from "./seed-data";
import type {
	Action,
	Ground,
	Group,
	Role,
	Subject,
} from "./src/generated/client/client";
import { Prisma, PrismaClient } from "./src/generated/client/client";
import { CategoryTypes } from "./src/generated/client/enums";

// Prisma 7: Adapter 패턴으로 PrismaClient 생성
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
	// Super Admin 데이터를 seed-data에서 가져오기
	const superAdminData = userSeedData.find((u) => u.role === "FULL_ACCESS");
	if (!superAdminData) throw new Error("FULL_ACCESS 유저 데이터가 seed-data에 없습니다.");

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

	// System Space 생성 (SpaceCategory ROOT로 식별)
	// SpaceClassification을 통해 ROOT Category가 연결된 Space가 System Space
	let systemSpace = await prisma.space.findFirst({
		where: {
			classification: {
				category: { name: "루트" },
			},
		},
	});

	if (!systemSpace) {
		systemSpace = await prisma.space.create({
			data: {
				tenants: {
					create: {
						userId: superAdminUser.id,
						roleId: roles.FULL_ACCESS.id,
					},
				},
			},
		});
		console.log("System Space 생성 완료 (FULL_ACCESS 전용)");
	} else {
		console.log(`System Space 이미 존재 (id=${systemSpace.id})`);
	}

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
		console.error("System Space의 tenant를 찾을 수 없어 Group을 생성할 수 없습니다.");
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

	// Subject 생성 (CASL Subject 정의)
	const subjects = await createSubjects();

	// Action 생성 (CASL Action 정의)
	const actions = await createActions();

	// Ability 생성 (Role별 권한) - CASL ABAC 기반
	await createAbilities(roles, subjects, actions);

	// OIDC Client 생성
	await createOidcClients();

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

async function createRoleGroupsAndAssociations(roles: Record<string, Role>, systemSpaceId: string) {
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
		const abilityName = abilityData.name ??
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
			console.log(`  - OIDC Client 생성: ${clientData.clientId} (${clientData.clientName})`);
		} else {
			skippedCount++;
			console.log(`  - OIDC Client 이미 존재: ${clientData.clientId}`);
		}
	}

	console.log(
		`✅ OIDC Client 시드 완료! (생성: ${createdCount}개, 스킵: ${skippedCount}개)`,
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
		const existingClassification =
			await prisma.spaceClassification.findFirst({
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
			console.log(`  - BRANCH 할당: ${ground.name} (spaceId=${ground.spaceId.slice(-8)})`);
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
