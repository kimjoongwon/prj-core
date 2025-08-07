import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { GroupNames } from "../src/enum/group-names.enum";
import { groundSeedData, userGroundMapping, userSeedData } from "./seed-data";

const prisma = new PrismaClient();
async function main() {
	const hashedPassword = await hash("rkdmf12!@", 10);

	// 먼저 Role들을 생성
	const superAdminRole = await prisma.role.upsert({
		where: { name: "SUPER_ADMIN" },
		update: {},
		create: { name: "SUPER_ADMIN" },
	});

	const adminRole = await prisma.role.upsert({
		where: { name: "ADMIN" },
		update: {},
		create: { name: "ADMIN" },
	});

	const userRole = await prisma.role.upsert({
		where: { name: "USER" },
		update: {},
		create: { name: "USER" },
	});

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
					roleId: superAdminRole.id,
					main: true,
				},
			},
		},
	});

	if (!superAdminSpace) {
		superAdminSpace = await prisma.space.create({
			data: {
				tenants: {
					create: {
						main: true,
						userId: superAdminUser.id,
						roleId: superAdminRole.id,
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
					tenantId: firstTenant.id,
				},
			});

			if (!existingGroup) {
				await prisma.group.create({
					data: {
						tenantId: firstTenant.id,
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

	// SUPER_ADMIN Role을 롤 카테고리와 연결
	await connectSuperAdminToRoleCategories(superAdminRole);

	// 일반 유저들과 그라운드 생성
	await createRegularUsersAndGrounds(adminRole, userRole);

	console.log({ superAdminUser });
}

async function createRegularUsersAndGrounds(adminRole: any, userRole: any) {
	console.log("일반 유저들과 그라운드 생성 시작...");

	// 각 그라운드 생성
	const createdGrounds: Array<{
		ground: any;
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
							main: true,
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
		const userMapping = userGroundMapping[userIndex];

		try {
			// 유저가 이미 존재하는지 확인
			const existingUser = await prisma.user.findFirst({
				where: { name: userData.profile.name },
			});

			if (!existingUser) {
				const hashedPassword = await hash(userData.password, 10);

				// 유저가 소속될 그라운드들
				const userGrounds: Array<{
					ground: any;
					index: number;
					spaceId: string;
				}> = [];
				for (const groundIndex of userMapping.groundIndices) {
					const groundInfo = createdGrounds.find(
						(g) => g.index === groundIndex,
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
					for (let i = 0; i < userGrounds.length; i++) {
						const groundInfo = userGrounds[i];
						const isMain = i === 0; // 첫 번째 그라운드를 메인으로 설정

						const existingUserTenant = await prisma.tenant.findFirst({
							where: {
								userId: user.id,
								spaceId: groundInfo.spaceId,
								roleId: userRole.id,
							},
						});

						if (!existingUserTenant) {
							await prisma.tenant.create({
								data: {
									main: isMain,
									userId: user.id,
									spaceId: groundInfo.spaceId,
									roleId: userRole.id,
								},
							});
						}
					}

					console.log(
						`일반 유저 생성 완료: ${userData.profile.name} (그라운드 ${userGrounds.length}개 소속)`,
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

	// 최상위 카테고리 '공통' 생성
	const parentCategory = await prisma.category.upsert({
		where: { name: "공통" },
		update: {},
		create: {
			name: "공통",
			type: "Role",
			tenantId: tenant.id,
		},
	});

	console.log(`최상위 카테고리 생성 완료: ${parentCategory.name}`);

	// 하위 카테고리들 생성
	const subCategories = ["유저", "운영자", "트레이너"];

	for (const categoryName of subCategories) {
		const category = await prisma.category.upsert({
			where: { name: categoryName },
			update: {},
			create: {
				name: categoryName,
				type: "Role",
				parentId: parentCategory.id,
				tenantId: tenant.id,
			},
		});
		console.log(`하위 카테고리 생성 완료: ${category.name}`);
	}

	console.log("Role 카테고리 생성 완료!");
}

async function connectSuperAdminToRoleCategories(superAdminRole: any) {
	console.log("SUPER_ADMIN Role을 카테고리와 연결 시작...");

	// "공통" 카테고리 조회
	const commonCategory = await prisma.category.findFirst({
		where: { 
			name: "공통",
			type: "Role" 
		}
	});

	if (!commonCategory) {
		console.error("'공통' 카테고리를 찾을 수 없습니다.");
		return;
	}

	// SUPER_ADMIN Role을 "공통" 카테고리와 연결
	const existingRoleClassification = await prisma.roleClassification.findFirst({
		where: {
			roleId: superAdminRole.id,
			categoryId: commonCategory.id
		}
	});

	if (!existingRoleClassification) {
		await prisma.roleClassification.create({
			data: {
				roleId: superAdminRole.id,
				categoryId: commonCategory.id
			}
		});
		console.log(`SUPER_ADMIN Role이 '${commonCategory.name}' 카테고리와 연결되었습니다.`);
	} else {
		console.log(`SUPER_ADMIN Role이 이미 '${commonCategory.name}' 카테고리와 연결되어 있습니다.`);
	}

	// 하위 카테고리들과도 연결
	console.log("SUPER_ADMIN Role과 카테고리 연결 완료!");
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

const spaceGroupSeed: Array<{ name: string; label: string; tenantId: string }> =
	[
		{
			name: GroupNames.TEAM_TRAINING.name,
			label: "",
			tenantId: "",
		},
		{
			name: GroupNames.PERSONAL_TRAINNING.name,
			label: "",
			tenantId: "",
		},
		{
			name: GroupNames.GROUND.name,
			label: "",
			tenantId: "",
		},
		{
			name: GroupNames.PILATES.name,
			label: "",
			tenantId: "",
		},
	];
