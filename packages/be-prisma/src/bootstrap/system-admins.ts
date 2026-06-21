import { hash } from "bcrypt";
import type { Prisma, PrismaClient, User } from "../generated/client/client";
import { SYSTEM_SPACE_ID, SYSTEM_TENANT_ID } from "../reference-data/constants";
import { systemAdminSeedData } from "./data/system-users";

type SystemAdminDbClient = PrismaClient | Prisma.TransactionClient;

function resolveSystemAdminSeeds(targetEmails?: readonly string[]) {
	if (!targetEmails || targetEmails.length === 0) {
		return systemAdminSeedData;
	}

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
	userId: string,
	name: string,
	nickname: string,
): Promise<void> {
	const existingProfile = await db.profile.findFirst({
		where: {
			userId,
			removedAt: null,
		},
	});

	if (existingProfile) {
		return;
	}

	await db.profile.create({
		data: {
			userId,
			name,
			nickname,
			address: "",
		},
	});
}

export async function ensureSystemAdminUsers(
	db: SystemAdminDbClient,
	platformAdminRoleId: string,
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
			const legacySystemAdminUser =
				userData.legacyEmails && userData.legacyEmails.length > 0
					? await db.user.findFirst({
							where: {
								email: {
									in: userData.legacyEmails,
								},
							},
						})
					: null;
			const hashedPassword = await hash(userData.password, 10);

			if (legacySystemAdminUser) {
				systemAdminUser = await db.user.update({
					where: { id: legacySystemAdminUser.id },
					data: {
						name: userData.profile.name,
						phone: userData.phone,
						email: userData.email,
						password: hashedPassword,
						failedLoginAttempts: 0,
						lockedUntil: null,
						isPermanentlyLocked: false,
						mustChangePassword: false,
					},
				});
				console.log(
					`System admin user migrated: ${legacySystemAdminUser.email} -> ${userData.email}`,
				);
				await ensureSystemAdminProfile(
					db,
					systemAdminUser.id,
					userData.profile.name,
					userData.profile.nickname,
				);
			} else {
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
				userId: systemAdminUser.id,
				spaceId: SYSTEM_SPACE_ID,
				roleId: platformAdminRoleId,
				removedAt: null,
			},
		});

		if (!existingTenant) {
			await db.tenant.create({
				data: {
					...(userData.email === "admin@plate.com"
						? { id: SYSTEM_TENANT_ID }
						: {}),
					userId: systemAdminUser.id,
					spaceId: SYSTEM_SPACE_ID,
					roleId: platformAdminRoleId,
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
