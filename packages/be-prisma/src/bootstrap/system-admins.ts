import { hash } from "bcrypt";
import type { Prisma, PrismaClient, User } from "../generated/client/client";
import {
	SYSTEM_SPACE_ULID,
	SYSTEM_TENANT_ULID,
} from "../reference-data/constants";
import { resolveSystemAdminSeedData } from "./data/system-users";

type SystemAdminDbClient = PrismaClient | Prisma.TransactionClient;

type DbId = bigint;

function resolveSystemAdminSeeds(targetEmails?: readonly string[]) {
	if (!targetEmails || targetEmails.length === 0) {
		return resolveSystemAdminSeedData();
	}
	const systemAdminSeedData = resolveSystemAdminSeedData();

	const emailSet = new Set(targetEmails);
	const matchedSeeds = systemAdminSeedData.filter((seed) =>
		emailSet.has(seed.email),
	);

	if (matchedSeeds.length !== emailSet.size) {
		const matchedEmailSet = new Set(matchedSeeds.map((seed) => seed.email));
		const missingEmails = [...emailSet].filter(
			(email) => !matchedEmailSet.has(email),
		);
		throw new Error(
			`Unknown system admin seed email: ${missingEmails.join(", ")}`,
		);
	}

	return matchedSeeds;
}

async function ensureSystemAdminProfile(
	db: SystemAdminDbClient,
	userSeq: DbId,
	name: string,
	nickname: string,
): Promise<void> {
	const existingProfile = await db.profile.findFirst({
		where: {
			user: { seq: userSeq },
			removedAt: null,
		},
	});

	if (existingProfile) {
		return;
	}

	await db.profile.create({
		data: {
			user: { connect: { seq: userSeq } },
			name,
			nickname,
			address: "",
		},
	});
}

export async function ensureSystemAdminUsers(
	db: SystemAdminDbClient,
	platformAdminRoleId: DbId,
	options?: {
		emails?: readonly string[];
	},
): Promise<User[]> {
	const ensuredUsers: User[] = [];

	for (const userData of resolveSystemAdminSeeds(options?.emails)) {
		let systemAdminUser = await db.user.findUnique({
			where: { email: userData.email },
		});

		if (!systemAdminUser) {
			const hashedPassword = await hash(userData.password, 10);

			{
				systemAdminUser = await db.user.create({
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
								address: "",
							},
						},
					},
				});
				console.log(`System admin user created: ${userData.email}`);
			}
		} else {
			await ensureSystemAdminProfile(
				db,
				systemAdminUser.seq,
				userData.profile.name,
				userData.profile.nickname,
			);
			console.log(`System admin user exists: ${userData.email}`);
		}

		const existingTenant = await db.tenant.findFirst({
			where: {
				user: { seq: systemAdminUser.seq },
				space: { id: SYSTEM_SPACE_ULID },
				role: { seq: platformAdminRoleId },
				removedAt: null,
			},
		});

		if (existingTenant) {
			console.log(`System admin tenant exists: ${userData.email}`);
		} else {
			// SYSTEM_TENANT_ULID는 전역 고유키다. 부트스트랩 계정이 달라져도
			// 이미 다른 시드 계정(예: e2e admin@plate.com)이 이 테넌트를 소유하면
			// 유니크 제약 실패로 전체 부트스트랩이 죽지 않도록 생성을 건너뛴다.
			const tenantOwnedByOtherAccount = await db.tenant.findUnique({
				where: { id: SYSTEM_TENANT_ULID },
			});
			if (tenantOwnedByOtherAccount) {
				console.log(
					`System admin tenant already owned by another seed account — skip: ${userData.email}`,
				);
			} else {
				await db.tenant.create({
					data: {
						id: SYSTEM_TENANT_ULID,
						user: { connect: { seq: systemAdminUser.seq } },
						space: { connect: { id: SYSTEM_SPACE_ULID } },
						role: { connect: { seq: platformAdminRoleId } },
					},
				});
				console.log(`System admin tenant created: ${userData.email}`);
			}
		}

		ensuredUsers.push(systemAdminUser);
	}

	return ensuredUsers;
}
