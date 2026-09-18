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
	userId: DbId,
	name: string,
	nickname: string,
): Promise<void> {
	const existingProfile = await db.profile.findFirst({
		where: {
			user: { id: userId },
			removedAt: null,
		},
	});

	if (existingProfile) {
		return;
	}

	await db.profile.create({
		data: {
			user: { connect: { id: userId } },
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
				systemAdminUser.id,
				userData.profile.name,
				userData.profile.nickname,
			);
			console.log(`System admin user exists: ${userData.email}`);
		}

		const existingTenant = await db.tenant.findFirst({
			where: {
				user: { id: systemAdminUser.id },
				space: { spaceId: SYSTEM_SPACE_ULID },
				role: { id: platformAdminRoleId },
				removedAt: null,
			},
		});

		if (!existingTenant) {
			await db.tenant.create({
				data: {
					tenantId: SYSTEM_TENANT_ULID,
					user: { connect: { id: systemAdminUser.id } },
					space: { connect: { spaceId: SYSTEM_SPACE_ULID } },
					role: { connect: { id: platformAdminRoleId } },
				},
			});
			console.log(`System admin tenant created: ${userData.email}`);
		} else {
			console.log(`System admin tenant exists: ${userData.email}`);
		}

		ensuredUsers.push(systemAdminUser);
	}

	return ensuredUsers;
}
