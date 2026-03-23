import { hash } from "bcrypt";

import { groundSeedData, userGroundMapping, userSeedData } from "../demo-data";
import type {
	Ground,
	PrismaClient,
	Role,
	User,
} from "../generated/client/client";
import { SYSTEM_SPACE_ID } from "../reference-data/constants";
import { syncReferenceData } from "../reference-data/sync-reference-data";
import { ensureSystemAdminUsers } from "./system-admins";

const systemSpaceGroupNames = [
	"TEAM_TRAINING",
	"PERSONAL_TRAINNING",
	"GROUND",
	"PILATES",
] as const;

export interface SystemBootstrapResult {
	manageRole: Role;
	superAdminUser: User;
}

/**
 * reference-data sync 결과에서 필수 역할을 꺼냅니다.
 *
 * bootstrap은 특정 시스템 역할의 존재를 전제로 하므로, 누락 시 조용히 진행하지 않고
 * 즉시 실패시켜 원인을 드러냅니다.
 */
function getRequiredRole(roles: Record<string, Role>, roleName: string): Role {
	const role = roles[roleName];
	if (!role) {
		throw new Error(`Required seeded role is missing: ${roleName}`);
	}

	return role;
}

/**
 * system space에 속한 기본 group row를 보장합니다.
 *
 * 이 group들은 운영 기준 데이터라기보다 system tenant가 생긴 뒤에야 만들 수 있는
 * 로컬 구조물이므로 bootstrap 단계에서 별도로 생성합니다.
 */
async function ensureSystemSpaceGroups(prisma: PrismaClient): Promise<void> {
	// These group rows are system-space local structure, so they are created only
	// after the system tenant exists.
	const firstTenant = await prisma.tenant.findFirst({
		where: { spaceId: SYSTEM_SPACE_ID },
	});

	if (!firstTenant) {
		console.error(
			"System Space의 tenant를 찾을 수 없어 Group을 생성할 수 없습니다.",
		);
		return;
	}

	for (const groupName of systemSpaceGroupNames) {
		const existingGroup = await prisma.group.findFirst({
			where: {
				name: groupName,
				spaceId: firstTenant.spaceId,
			},
		});

		if (!existingGroup) {
			await prisma.group.create({
				data: {
					spaceId: firstTenant.spaceId,
					name: groupName,
					type: "Space",
				},
			});
			console.log(`Group 생성 완료: ${groupName}`);
		} else {
			console.log(`Group 이미 존재: ${groupName}`);
		}
	}
}

/**
 * system space, super admin, system ground 같은 최상위 bootstrap 자원을 준비합니다.
 *
 * 이 단계는 reference-data sync를 선행 호출해 역할/분류 체계를 확보한 뒤,
 * 새 환경을 실제로 접속 가능한 상태로 만드는 최소 계정을 세웁니다.
 */
export async function ensureSystemBootstrap(
	prisma: PrismaClient,
): Promise<SystemBootstrapResult> {
	// Reference data must exist before bootstrap because role/system-space
	// contracts are reused immediately below.
	const { roles } = await syncReferenceData(prisma);
	const fullAccessRole = getRequiredRole(roles, "FULL_ACCESS");
	const manageRole = getRequiredRole(roles, "MANAGE");

	const superAdminUsers = await ensureSystemAdminUsers(
		prisma,
		fullAccessRole.id,
	);
	const [superAdminUser] = superAdminUsers;
	if (!superAdminUser) {
		throw new Error("시스템 관리자 계정 seed 데이터가 없습니다.");
	}

	console.log(`System Space 준비 완료 (id=${SYSTEM_SPACE_ID})`);

	// One ground in the demo dataset is treated as the canonical system ground.
	const systemGroundData = groundSeedData.find((ground) => ground.isSystem);
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

	await ensureSystemSpaceGroups(prisma);

	return {
		manageRole,
		superAdminUser,
	};
}

/**
 * 일반 demo 사용자와 branch ground를 생성하고 tenant를 연결합니다.
 *
 * ground 생성이 먼저, 사용자 소속 연결이 나중인 2-pass 구조를 쓰는 이유는
 * user-ground 매핑이 이미 만들어진 ground의 spaceId를 참조해야 하기 때문입니다.
 */
export async function createRegularUsersAndGrounds(
	prisma: PrismaClient,
	adminRole: Role,
): Promise<void> {
	console.log("일반 유저들과 그라운드 생성 시작...");

	// Demo user rows refer to role names, so resolve the current role catalog
	// once before creating user/tenant memberships.
	const allRoles = await prisma.role.findMany();
	const roleMap: Record<string, Role> = {};
	for (const role of allRoles) {
		roleMap[role.name] = role;
	}

	const createdGrounds: Array<{ ground: Ground; spaceId: string }> = [];
	const defaultAdminPassword = await hash("admin123!@#", 10);

	// First create non-system grounds and their manager accounts. The resulting
	// space ids are reused when attaching regular demo users below.
	for (const groundData of groundSeedData) {
		if (groundData.isSystem) {
			continue;
		}

		try {
			const existingGround = await prisma.ground.findFirst({
				where: { businessNo: groundData.businessNo },
			});

			if (!existingGround) {
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

				const adminUser = await prisma.user.upsert({
					where: {
						phone: groundData.phone,
					},
					update: {},
					create: {
						name: `${groundData.name} 관리자`,
						phone: groundData.phone,
						email: groundData.email,
						password: defaultAdminPassword,
						profiles: {
							create: {
								name: `${groundData.name} 관리자`,
								nickname: `${groundData.name}관리자`,
							},
						},
					},
				});

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
					spaceId: space.id,
				});
				console.log(`그라운드 생성 완료: ${groundData.name}`);
			} else {
				console.log(`그라운드 이미 존재: ${groundData.name}`);
				createdGrounds.push({
					ground: existingGround,
					spaceId: existingGround.spaceId,
				});
			}
		} catch (error) {
			console.error(`그라운드 생성 실패 (${groundData.name}):`, error);
		}
	}

	// Second pass: attach regular demo users to the spaces that were just
	// created, using the explicit ground mapping table as the source of truth.
	for (const userData of userSeedData) {
		if (userData.role === "FULL_ACCESS") {
			continue;
		}

		const userMapping = userGroundMapping.find(
			(mapping) => mapping.userEmail === userData.email,
		);

		if (!userMapping) {
			console.log(`유저 매핑을 찾을 수 없음: ${userData.email}`);
			continue;
		}

		try {
			const existingUser = await prisma.user.findFirst({
				where: { email: userData.email },
			});

			if (existingUser) {
				console.log(`유저 이미 존재: ${userData.profile.name}`);
				continue;
			}

			const hashedPassword = await hash(userData.password, 10);
			const userGrounds: Array<{ ground: Ground; spaceId: string }> = [];

			for (const groundName of userMapping.groundNames) {
				const groundInfo = createdGrounds.find(
					(groundEntry) => groundEntry.ground.name === groundName,
				);
				if (groundInfo) {
					userGrounds.push(groundInfo);
				}
			}

			if (userGrounds.length === 0) {
				continue;
			}

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

			const assignedRole = roleMap[userData.role || "VIEW"];
			if (!assignedRole) {
				throw new Error(
					`유저 role을 찾을 수 없습니다: ${userData.email} -> ${userData.role || "VIEW"}`,
				);
			}

			for (const groundInfo of userGrounds) {
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
		} catch (error) {
			console.error(`일반 유저 생성 실패 (${userData.profile.name}):`, error);
		}
	}

	console.log("일반 유저들과 그라운드 생성 완료!");
}

/**
 * system space를 제외한 모든 ground space를 BRANCH로 분류합니다.
 *
 * reference-data가 ROOT 분류를 만들고, bootstrap이 실제 ground row를 만든 뒤에야
 * branch classification을 안전하게 채울 수 있습니다.
 */
export async function classifyGroundSpacesAsBranch(
	prisma: PrismaClient,
	systemSpaceId = SYSTEM_SPACE_ID,
): Promise<void> {
	console.log("Ground Space에 BRANCH SpaceClassification 할당 시작...");

	const branchCategory = await prisma.category.findFirst({
		where: { name: "지점", type: "Space" },
	});

	if (!branchCategory) {
		console.error("BRANCH Space Category를 찾을 수 없습니다.");
		return;
	}

	const grounds = await prisma.ground.findMany();
	let syncedCount = 0;

	// Every non-system ground space should classify as BRANCH, while the system
	// space keeps the ROOT classification established by reference data.
	for (const ground of grounds) {
		if (ground.spaceId === systemSpaceId) {
			continue;
		}

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
		syncedCount++;
		console.log(
			`  - BRANCH 할당: ${ground.name} (spaceId=${ground.spaceId.slice(-8)})`,
		);
	}

	console.log(`Ground Space BRANCH 할당 완료! (동기화: ${syncedCount}개)`);
}

/**
 * ROOT tenant를 각 BRANCH space로 미러링해 계층형 접근 구조를 만듭니다.
 *
 * dev/stg 환경에서 관리자가 branch별로 바로 진입 가능하도록 만드는 bootstrap 편의 레이어입니다.
 */
export async function createHierarchicalTenants(
	prisma: PrismaClient,
	systemSpaceId = SYSTEM_SPACE_ID,
): Promise<void> {
	console.log("계층적 Tenant 생성 시작 (ROOT → BRANCH)...");

	const rootTenants = await prisma.tenant.findMany({
		where: { spaceId: systemSpaceId },
	});

	if (rootTenants.length === 0) {
		console.log("ROOT Space에 tenant가 없어 스킵합니다.");
		return;
	}

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

	// Mirror ROOT memberships into every BRANCH space so bootstrap environments
	// start with an immediately navigable tenant hierarchy.
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
