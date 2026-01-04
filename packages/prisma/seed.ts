import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt";
import pg from "pg";
import {
	groundSeedData,
	reservationColumnDefinitions,
	roleAssociationSeedData,
	roleCategorySeedData,
	roleClassificationSeedData,
	roleColumnDefinitions,
	roleGroupSeedData,
	roleSeedData,
	userColumnDefinitions,
	userGroundMapping,
	userSeedData,
} from "./seed-data";
import { PrismaClient } from "./src/generated/client/client";

// Prisma 7: Adapter 패턴으로 PrismaClient 생성
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as unknown);
async function main() {
	const hashedPassword = await hash("rkdmf12!@", 10);

	// Role들을 seed-data.ts 기반으로 생성
	const roles: Record<string, unknown> = {};
	for (const roleData of roleSeedData) {
		roles[roleData.name] = await prisma.role.upsert({
			where: { name: roleData.name },
			update: {},
			create: { name: roleData.name },
		});
		console.log(`Role 생성 완료: ${roleData.name}`);
	}

	// Super Admin 유저 생성
	const superAdminUser = await prisma.user.upsert({
		where: {
			phone: "01073162347",
		},
		update: {},
		create: {
			name: "Super Admin",
			phone: "01073162347",
			email: "admin@plate.com",
			password: hashedPassword,
			profiles: {
				create: {
					name: "Plate",
					nickname: "플레이트",
				},
			},
		},
	});

	// Space 생성 (기존 Space가 있는지 확인)
	let superAdminSpace = await prisma.space.findFirst({
		where: {
			tenants: {
				some: {
					userId: superAdminUser.id,
					roleId: roles.SUPER_ADMIN.id,
				},
			},
		},
	});

	if (!superAdminSpace) {
		superAdminSpace = await prisma.space.create({
			data: {
				tenants: {
					create: {
						userId: superAdminUser.id,
						roleId: roles.SUPER_ADMIN.id,
					},
				},
			},
		});
		console.log("Super Admin Space 생성 완료");
	} else {
		console.log("Super Admin Space 이미 존재");
	}

	// 워크스페이스 생성
	const _ground = await prisma.ground.upsert({
		where: {
			businessNo: "12345678902",
		},
		update: {},
		create: {
			name: "(주)플레이트",
			label: "본점",
			address: "서울시 강남구",
			phone: "01073162347",
			email: "plate@gmail.com",
			businessNo: "12345678902",
			spaceId: superAdminSpace.id,
		},
	});

	// Ground 생성 (임시로 주석 처리)
	// await prisma.ground.create({
	//   data: {
	//     name: '플레이트 본점',
	//     label: '메인 지점',
	//     address: '서울시 강남구',
	//     phone: '01073162347',
	//     email: 'plate@gmail.com',
	//     businessNo: '12345678901', // 다른 번호
	//     spaceId: ground.spaceId,
	//   },
	// });

	// Group 생성을 위한 tenant 조회
	const firstTenant = await prisma.tenant.findFirst({
		where: { seq: 1 },
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
		console.error("seq=1인 tenant를 찾을 수 없어 Group을 생성할 수 없습니다.");
	}

	// Role 타입 카테고리 생성
	await createRoleCategories();

	// Role과 Category 연결 (RoleClassification)
	await createRoleClassifications(roles);

	// Role 관련 Group 생성 및 RoleAssociation 연결
	await createRoleGroupsAndAssociations(roles);

	// 일반 유저들과 그라운드 생성
	await createRegularUsersAndGrounds(roles.ADMIN, roles.USER);

	// Subject 생성 (메뉴 권한용)
	await createSubjects();

	// 컬럼 정의 생성
	await createColumnDefinitions();

	console.log({ superAdminUser });
}

async function createRegularUsersAndGrounds(
	adminRole: unknown,
	_userRole: unknown,
) {
	console.log("일반 유저들과 그라운드 생성 시작...");

	// 모든 Role 조회 (seed-data의 role 필드 사용을 위해)
	const allRoles = await prisma.role.findMany();
	const roleMap: Record<string, unknown> = {};
	for (const role of allRoles) {
		roleMap[role.name] = role;
	}

	// 각 그라운드 생성
	const createdGrounds: Array<{
		ground: unknown;
		index: number;
		spaceId: string;
	}> = [];
	for (let i = 0; i < groundSeedData.length; i++) {
		const groundData = groundSeedData[i];

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
					const assignedRole = roleMap[userData.role || "USER"];

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
						`유저 생성 완료: ${userData.profile.name} [${userData.role || "USER"}] (그라운드 ${userGrounds.length}개 소속)`,
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

async function createRoleCategories() {
	console.log("Role 카테고리 생성 시작...");

	// seq=1인 tenant 조회
	const tenant = await prisma.tenant.findFirst({
		where: { seq: 1 },
	});

	if (!tenant) {
		console.error("seq=1인 tenant를 찾을 수 없습니다.");
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
				type: categoryData.type as unknown,
				spaceId: tenant.spaceId,
				// parentId는 나중에 별도로 설정 (현재는 평면 구조)
			},
		});
		console.log(
			`카테고리 생성 완료: ${roleCategoryEnum.code} - ${roleCategoryEnum.name}`,
		);
	}

	console.log("Role 카테고리 생성 완료!");
}

async function createRoleClassifications(roles: Record<string, unknown>) {
	console.log("Role과 Category 연결 (RoleClassification) 시작...");

	for (const classificationData of roleClassificationSeedData) {
		// 해당 Role 찾기
		const role = roles[classificationData.roleName];
		if (!role) {
			console.error(`Role을 찾을 수 없습니다: ${classificationData.roleName}`);
			continue;
		}

		// 해당 Category 찾기 (enum 사용)
		const roleCategoryEnum = classificationData.roleCategoryEnum;
		const category = await prisma.category.findFirst({
			where: {
				name: roleCategoryEnum.name, // enum의 name 속성 사용
				type: "Role",
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

async function createRoleGroupsAndAssociations(roles: Record<string, unknown>) {
	console.log("Role 관련 Group 생성 및 RoleAssociation 연결 시작...");

	// seq=1인 tenant 조회 (Group 생성에 필요)
	const tenant = await prisma.tenant.findFirst({
		where: { seq: 1 },
	});

	if (!tenant) {
		console.error("seq=1인 tenant를 찾을 수 없습니다.");
		return;
	}

	// Role용 Group들 생성 (RoleGroupSeedData 기반)
	const groups: Record<string, unknown> = {};
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

async function createColumnDefinitions() {
	console.log("컬럼 정의 생성 시작...");

	// 모든 Space 조회
	const spaces = await prisma.space.findMany({
		take: 5, // 최대 5개 Space에만 시드 데이터 생성
	});

	if (spaces.length === 0) {
		console.error("생성된 Space가 없어 컬럼 정의를 생성할 수 없습니다.");
		return;
	}

	// 각 Space에 대해 컬럼 정의 생성
	for (const space of spaces) {
		console.log(`Space ${space.id}에 컬럼 정의 생성 중...`);

		// User 엔티티 컬럼 정의
		for (const columnDef of userColumnDefinitions) {
			const existing = await prisma.columnDefinition.findFirst({
				where: {
					entity: columnDef.entity,
					field: columnDef.field,
					spaceId: space.id,
				},
			});

			if (!existing) {
				await prisma.columnDefinition.create({
					data: {
						...columnDef,
						spaceId: space.id,
					},
				});
			}
		}
		console.log(`  - User 컬럼 정의 ${userColumnDefinitions.length}개 생성`);

		// Reservation 엔티티 컬럼 정의
		for (const columnDef of reservationColumnDefinitions) {
			const existing = await prisma.columnDefinition.findFirst({
				where: {
					entity: columnDef.entity,
					field: columnDef.field,
					spaceId: space.id,
				},
			});

			if (!existing) {
				await prisma.columnDefinition.create({
					data: {
						...columnDef,
						spaceId: space.id,
					},
				});
			}
		}
		console.log(
			`  - Reservation 컬럼 정의 ${reservationColumnDefinitions.length}개 생성`,
		);

		// Role 엔티티 컬럼 정의
		for (const columnDef of roleColumnDefinitions) {
			const existing = await prisma.columnDefinition.findFirst({
				where: {
					entity: columnDef.entity,
					field: columnDef.field,
					spaceId: space.id,
				},
			});

			if (!existing) {
				await prisma.columnDefinition.create({
					data: {
						...columnDef,
						spaceId: space.id,
					},
				});
			}
		}
		console.log(`  - Role 컬럼 정의 ${roleColumnDefinitions.length}개 생성`);
	}

	console.log("컬럼 정의 생성 완료!");
}

async function createSubjects() {
	console.log("Subject 생성 시작...");

	// 첫 번째 Tenant 조회 (tenantId 필요)
	const firstTenant = await prisma.tenant.findFirst({
		where: { seq: 1 },
	});

	if (!firstTenant) {
		console.error("Tenant를 찾을 수 없어 Subject를 생성할 수 없습니다.");
		return;
	}

	// 메뉴 Subject들 생성
	const menuSubjects = [
		// 설정 메뉴
		{
			name: "menu:settings",
			type: "Menu" as const,
			label: "설정",
			description: "설정 메뉴",
		},
		{
			name: "menu:settings:columns",
			type: "Menu" as const,
			label: "컬럼 가시성 관리",
			description: "컬럼 가시성 관리 메뉴",
		},
		{
			name: "menu:settings:permissions",
			type: "Menu" as const,
			label: "권한 관리",
			description: "권한 관리 메뉴",
		},
	];

	for (const subjectData of menuSubjects) {
		const existing = await prisma.subject.findFirst({
			where: { name: subjectData.name },
		});

		if (!existing) {
			await prisma.subject.create({
				data: {
					...subjectData,
					tenantId: firstTenant.id,
				},
			});
			console.log(`  - Subject 생성: ${subjectData.name}`);
		} else {
			console.log(`  - Subject 이미 존재: ${subjectData.name}`);
		}
	}

	console.log("Subject 생성 완료!");
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
