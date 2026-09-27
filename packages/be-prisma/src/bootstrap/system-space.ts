import { hash } from "bcrypt";

import {
	fitnessCenterSeedData,
	userFitnessCenterMapping,
	userSeedData,
} from "../demo-data";
import type {
	FitnessCenter,
	PrismaClient,
	Role,
	User,
} from "../generated/client/client";
import { SYSTEM_SPACE_ULID } from "../reference-data/constants";
import { syncReferenceData } from "../reference-data/sync-reference-data";
import { resolveSystemAdminSeedData } from "./data/system-users";
import { ensureSystemAdminUsers } from "./system-admins";

type DbId = bigint;

const systemSpaceGroupNames = [
	"TEAM_TRAINING",
	"PERSONAL_TRAINNING",
	"FITNESSCENTER",
	"PILATES",
] as const;

export interface SystemBootstrapResult {
	companyManagerRole: Role;
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
		where: { space: { spaceId: SYSTEM_SPACE_ULID } },
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
				space: { spaceId: SYSTEM_SPACE_ULID },
			},
		});

		if (!existingGroup) {
			await prisma.group.create({
				data: {
					spaceId: firstTenant.spaceId,
					createdById: firstTenant.userId,
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
 * system space, super admin, system fitness center 같은 최상위 bootstrap 자원을 준비합니다.
 *
 * 이 단계는 reference-data sync를 선행 호출해 역할/분류 체계를 확보한 뒤,
 * 새 환경을 실제로 접속 가능한 상태로 만드는 최소 계정을 세웁니다.
 */
export async function ensureSystemBootstrap(
	prisma: PrismaClient,
): Promise<SystemBootstrapResult> {
	// Reference data must exist before bootstrap because role/system-space
	// contracts are reused immediately below.
	const referenceData = await syncReferenceData(prisma);
	const platformAdminRole = getRequiredRole(
		referenceData.roles,
		"PLATFORM_ADMIN",
	);
	const companyManagerRole = getRequiredRole(
		referenceData.roles,
		"COMPANY_MANAGER",
	);
	const systemSpace = await prisma.space.findUniqueOrThrow({
		where: { spaceId: SYSTEM_SPACE_ULID },
	});

	const superAdminUsers = await ensureSystemAdminUsers(
		prisma,
		platformAdminRole.id,
	);
	const [superAdminUser] = superAdminUsers;
	if (!superAdminUser) {
		throw new Error("시스템 관리자 계정 seed 데이터가 없습니다.");
	}

	console.log(`System Space 준비 완료 (ulid=${SYSTEM_SPACE_ULID})`);

	// One fitness center in the demo dataset is treated as the canonical system one.
	const systemFitnessCenterData = fitnessCenterSeedData.find(
		(fitnessCenter) => fitnessCenter.isSystem,
	);
	if (systemFitnessCenterData) {
		const systemFitnessCenter = await prisma.fitnessCenter.findFirst({
			where: { space: { spaceId: SYSTEM_SPACE_ULID } },
			include: { company: true },
		});

		if (systemFitnessCenter) {
			await prisma.company.update({
				where: { id: systemFitnessCenter.company.id },
				data: {
					name: systemFitnessCenterData.name,
					label: systemFitnessCenterData.label,
					address: systemFitnessCenterData.address,
					phone: systemFitnessCenterData.phone,
					email: systemFitnessCenterData.email,
					businessNo: systemFitnessCenterData.businessNo,
				},
			});
			await prisma.fitnessCenter.update({
				where: { id: systemFitnessCenter.id },
				data: {
					name: systemFitnessCenterData.name,
					label: systemFitnessCenterData.label,
					address: systemFitnessCenterData.address,
					phone: systemFitnessCenterData.phone,
					email: systemFitnessCenterData.email,
				},
			});
		} else {
			const systemCompany = await prisma.company.create({
				data: {
					name: systemFitnessCenterData.name,
					label: systemFitnessCenterData.label,
					address: systemFitnessCenterData.address,
					phone: systemFitnessCenterData.phone,
					email: systemFitnessCenterData.email,
					businessNo: systemFitnessCenterData.businessNo,
				},
			});
			await prisma.fitnessCenter.create({
				data: {
					name: systemFitnessCenterData.name,
					label: systemFitnessCenterData.label,
					address: systemFitnessCenterData.address,
					phone: systemFitnessCenterData.phone,
					email: systemFitnessCenterData.email,
					companyId: systemCompany.id,
					spaceId: systemSpace.id,
				},
			});
		}
		console.log(
			`System Fitness Center 생성 완료: ${systemFitnessCenterData.name}`,
		);
	}

	await ensureSystemSpaceGroups(prisma);

	return {
		companyManagerRole,
		superAdminUser,
	};
}

/**
 * 일반 demo 사용자와 branch fitness center를 생성하고 tenant를 연결합니다.
 *
 * fitness center 생성이 먼저, 사용자 소속 연결이 나중인 2-pass 구조를 쓰는 이유는
 * user-fitness center 매핑이 이미 만들어진 fitness center의 spaceId를 참조해야 하기 때문입니다.
 */
export async function createRegularUsersAndFitnessCenters(
	prisma: PrismaClient,
	companyManagerRole: Role,
): Promise<void> {
	console.log("일반 유저들과 피트니스센터 생성 시작...");

	// Demo user rows refer to role names, so resolve the current role catalog
	// once before creating user/tenant memberships.
	const allRoles = await prisma.role.findMany();
	const roleMap: Record<string, Role> = {};
	for (const role of allRoles) {
		roleMap[role.name] = role;
	}

	const createdFitnessCenters: Array<{
		fitnessCenter: FitnessCenter;
		spaceId: DbId;
	}> = [];
	const defaultAdminPassword = await hash("admin123!@#", 10);

	// First create non-system fitness centers and their manager accounts. The resulting
	// space ids are reused when attaching regular demo users below.
	for (const fitnessCenterData of fitnessCenterSeedData) {
		if (fitnessCenterData.isSystem) {
			continue;
		}

		try {
			const existingFitnessCenter = await prisma.fitnessCenter.findFirst({
				where: { name: fitnessCenterData.name, removedAt: null },
				include: { company: true, space: true },
			});

			if (!existingFitnessCenter) {
				const space = await prisma.space.create({
					data: {},
				});

				const adminUser = await prisma.user.upsert({
					where: {
						phone: fitnessCenterData.phone,
					},
					update: {},
					create: {
						name: `${fitnessCenterData.name} 관리자`,
						phone: fitnessCenterData.phone,
						email: fitnessCenterData.email,
						password: defaultAdminPassword,
						status: {
							create: {},
						},
						profiles: {
							create: {
								name: `${fitnessCenterData.name} 관리자`,
								nickname: `${fitnessCenterData.name}관리자`,
								address: fitnessCenterData.address,
							},
						},
					},
				});

				const existingTenant = await prisma.tenant.findFirst({
					where: {
						userId: adminUser.id,
						spaceId: space.id,
						roleId: companyManagerRole.id,
					},
				});

				if (!existingTenant) {
					await prisma.tenant.create({
						data: {
							userId: adminUser.id,
							spaceId: space.id,
							roleId: companyManagerRole.id,
						},
					});
				}

				const company = await prisma.company.create({
					data: {
						name: fitnessCenterData.name,
						label: fitnessCenterData.label,
						address: fitnessCenterData.address,
						phone: fitnessCenterData.phone,
						email: fitnessCenterData.email,
						businessNo: fitnessCenterData.businessNo,
					},
				});
				const fitnessCenter = await prisma.fitnessCenter.create({
					data: {
						name: fitnessCenterData.name,
						label: fitnessCenterData.label,
						address: fitnessCenterData.address,
						phone: fitnessCenterData.phone,
						email: fitnessCenterData.email,
						companyId: company.id,
						spaceId: space.id,
					},
				});

				createdFitnessCenters.push({
					fitnessCenter,
					spaceId: space.id,
				});
				console.log(`피트니스센터 생성 완료: ${fitnessCenterData.name}`);
			} else {
				console.log(`피트니스센터 이미 존재: ${fitnessCenterData.name}`);
				createdFitnessCenters.push({
					fitnessCenter: existingFitnessCenter,
					spaceId: existingFitnessCenter.space.id,
				});
			}
		} catch (error) {
			console.error(
				`피트니스센터 생성 실패 (${fitnessCenterData.name}):`,
				error,
			);
		}
	}

	// Second pass: attach regular demo users to the spaces that were just
	// created, using the explicit fitness-center mapping table as the source of truth.
	for (const userData of userSeedData) {
		if (userData.role === "PLATFORM_ADMIN") {
			continue;
		}

		const userMapping = userFitnessCenterMapping.find(
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
			const userFitnessCenters: Array<{
				fitnessCenter: FitnessCenter;
				spaceId: DbId;
			}> = [];

			for (const fitnessCenterName of userMapping.fitnessCenterNames) {
				const fitnessCenterInfo = createdFitnessCenters.find(
					(fitnessCenterEntry) =>
						fitnessCenterEntry.fitnessCenter.name === fitnessCenterName,
				);
				if (fitnessCenterInfo) {
					userFitnessCenters.push(fitnessCenterInfo);
				}
			}

			if (userFitnessCenters.length === 0) {
				continue;
			}

			const user = await prisma.user.create({
				data: {
					name: userData.profile.name,
					phone: userData.phone,
					email: userData.email,
					password: hashedPassword,
					status: {
						create: {},
					},
					profiles: {
						create: {
							name: userData.profile.name,
							nickname: userData.profile.nickname,
							address: userFitnessCenters[0]?.fitnessCenter.address ?? "",
						},
					},
				},
			});

			const assignedRole = roleMap[userData.role || "MEMBER"];
			if (!assignedRole) {
				throw new Error(
					`유저 role을 찾을 수 없습니다: ${userData.email} -> ${userData.role || "MEMBER"}`,
				);
			}

			for (const fitnessCenterInfo of userFitnessCenters) {
				const existingUserTenant = await prisma.tenant.findFirst({
					where: {
						user: { id: user.id },
						space: { id: fitnessCenterInfo.spaceId },
						role: { id: assignedRole.id },
					},
				});

				if (!existingUserTenant) {
					await prisma.tenant.create({
						data: {
							user: { connect: { id: user.id } },
							space: { connect: { id: fitnessCenterInfo.spaceId } },
							role: { connect: { id: assignedRole.id } },
						},
					});
				}
			}

			console.log(
				`유저 생성 완료: ${userData.profile.name} [${userData.role || "MEMBER"}] (피트니스센터 ${userFitnessCenters.length}개 소속)`,
			);
		} catch (error) {
			console.error(`일반 유저 생성 실패 (${userData.profile.name}):`, error);
		}
	}

	console.log("일반 유저들과 피트니스센터 생성 완료!");
}

/**
 * system space를 제외한 모든 fitness center space를 BRANCH로 분류합니다.
 *
 * reference-data가 ROOT 분류를 만들고, bootstrap이 실제 fitness center row를 만든 뒤에야
 * branch classification을 안전하게 채울 수 있습니다.
 */
export async function classifyFitnessCenterSpacesAsBranch(
	prisma: PrismaClient,
	systemSpaceUlid = SYSTEM_SPACE_ULID,
): Promise<void> {
	console.log(
		"Company/Fitness Center가 연결된 Space에 BRANCH SpaceClassification 할당 시작...",
	);

	const branchCategory = await prisma.category.findFirst({
		where: { name: "지점" },
	});

	if (!branchCategory) {
		console.error("BRANCH Space Category를 찾을 수 없습니다.");
		return;
	}

	const fitnessCenters = await prisma.fitnessCenter.findMany({
		include: { space: true },
	});
	let syncedCount = 0;

	// Every non-system fitness center space should classify as BRANCH, while the system
	// space keeps the ROOT classification established by reference data.
	for (const fitnessCenter of fitnessCenters) {
		if (fitnessCenter.space.spaceId === systemSpaceUlid) {
			continue;
		}

		await prisma.spaceClassification.upsert({
			where: { spaceId: fitnessCenter.spaceId },
			create: {
				spaceId: fitnessCenter.spaceId,
				categoryId: branchCategory.id,
			},
			update: {
				categoryId: branchCategory.id,
			},
		});
		syncedCount++;
		console.log(
			`  - BRANCH 할당: ${fitnessCenter.name} (spaceId=${String(
				fitnessCenter.space.id,
			).slice(-8)})`,
		);
	}

	console.log(
		`Company/Fitness Center Space BRANCH 할당 완료! (동기화: ${syncedCount}개)`,
	);
}

/**
 * ROOT tenant를 각 BRANCH space로 미러링해 계층형 접근 구조를 만듭니다.
 *
 * dev/stg 환경에서 관리자가 branch별로 바로 진입 가능하도록 만드는 bootstrap 편의 레이어입니다.
 */
export async function createHierarchicalTenants(
	prisma: PrismaClient,
	systemSpaceUlid = SYSTEM_SPACE_ULID,
): Promise<void> {
	console.log(
		"계층적 Tenant 생성 시작 (ROOT PLATFORM_ADMIN → BRANCH COMPANY_MANAGER)...",
	);

	const companyManagerRole = await prisma.role.findFirst({
		where: {
			name: "COMPANY_MANAGER",
			removedAt: null,
		},
	});

	if (!companyManagerRole) {
		throw new Error(
			"COMPANY_MANAGER role is required before creating branch tenants.",
		);
	}

	const rootTenants = await prisma.tenant.findMany({
		where: {
			space: { spaceId: systemSpaceUlid },
			removedAt: null,
			user: {
				email: {
					in: resolveSystemAdminSeedData().map((user) => user.email),
				},
			},
		},
	});

	if (rootTenants.length === 0) {
		console.log("ROOT Space에 system admin tenant가 없어 스킵합니다.");
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

	// System admins keep PLATFORM_ADMIN only on ROOT. Branch memberships are
	// COMPANY_MANAGER so selecting a branch x-tenant-id does not open global resource scope.
	for (const rootTenant of rootTenants) {
		for (const branchSpace of branchSpaces) {
			const existingTenants = await prisma.tenant.findMany({
				where: {
					userId: rootTenant.userId,
					spaceId: branchSpace.id,
					removedAt: null,
				},
				select: {
					id: true,
					roleId: true,
				},
			});

			if (existingTenants.length === 0) {
				await prisma.tenant.create({
					data: {
						userId: rootTenant.userId,
						spaceId: branchSpace.id,
						roleId: companyManagerRole.id,
					},
				});
				createdCount++;
				continue;
			}

			const needsRoleUpdate = existingTenants.some(
				(tenant) => tenant.roleId !== companyManagerRole.id,
			);
			if (needsRoleUpdate) {
				await prisma.tenant.updateMany({
					where: {
						id: {
							in: existingTenants.map((tenant) => tenant.id),
						},
					},
					data: {
						roleId: companyManagerRole.id,
					},
				});
				createdCount++;
			} else {
				skippedCount++;
			}
		}
	}

	console.log(
		`계층적 Tenant 생성 완료! (생성/정규화: ${createdCount}개, 스킵: ${skippedCount}개)`,
	);
}
