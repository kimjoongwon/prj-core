import "../load-local-env";

import {
	actionSeedData,
	abilitySeedData,
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
} from "../../reference-data";
import { Prisma } from "../generated/client/client";
import type {
	Action,
	Group,
	PrismaClient,
	Role,
	Subject,
} from "../generated/client/client";
import { CategoryTypes } from "../generated/client/enums";
import { SYSTEM_SPACE_ID } from "./constants";

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface ReferenceDataSyncResult {
	roles: Record<string, Role>;
}

async function ensureSystemSpace(db: DbClient): Promise<void> {
	await db.space.upsert({
		where: { id: SYSTEM_SPACE_ID },
		update: {
			removedAt: null,
		},
		create: {
			id: SYSTEM_SPACE_ID,
		},
	});
}

async function syncSpaceCategories(db: DbClient): Promise<void> {
	const categoryMap = new Map<string, { id: string }>();

	for (const categoryData of spaceCategorySeedData) {
		const spaceCategoryEnum = categoryData.spaceCategoryEnum;
		const parentId = categoryData.parentCategoryCode
			? categoryMap.get(categoryData.parentCategoryCode)?.id ?? null
			: null;

		const category = await db.category.upsert({
			where: { name: spaceCategoryEnum.name },
			update: {
				type: categoryData.type as CategoryTypes,
				spaceId: SYSTEM_SPACE_ID,
				parentId,
				removedAt: null,
			},
			create: {
				name: spaceCategoryEnum.name,
				type: categoryData.type as CategoryTypes,
				spaceId: SYSTEM_SPACE_ID,
				parentId,
			},
		});

		categoryMap.set(spaceCategoryEnum.code, { id: category.id });
	}

	const rootCategory = categoryMap.get("ROOT");
	if (!rootCategory) {
		throw new Error("ROOT space category seed was not created.");
	}

	await db.spaceClassification.upsert({
		where: { spaceId: SYSTEM_SPACE_ID },
		update: {
			categoryId: rootCategory.id,
			removedAt: null,
		},
		create: {
			spaceId: SYSTEM_SPACE_ID,
			categoryId: rootCategory.id,
		},
	});
}

async function syncSpaceGroups(db: DbClient): Promise<void> {
	for (const groupData of spaceGroupSeedData) {
		const spaceGroupEnum = groupData.spaceGroupEnum;
		let group = await db.group.findFirst({
			where: {
				name: spaceGroupEnum.name,
				type: "Space",
				spaceId: SYSTEM_SPACE_ID,
			},
		});

		if (!group) {
			group = await db.group.create({
				data: {
					name: spaceGroupEnum.name,
					type: "Space",
					spaceId: SYSTEM_SPACE_ID,
				},
			});
		} else if (group.removedAt) {
			group = await db.group.update({
				where: { id: group.id },
				data: { removedAt: null },
			});
		}

		const existingAssociation = await db.spaceAssociation.findFirst({
			where: {
				spaceId: SYSTEM_SPACE_ID,
				groupId: group.id,
			},
		});

		if (!existingAssociation) {
			await db.spaceAssociation.create({
				data: {
					spaceId: SYSTEM_SPACE_ID,
					groupId: group.id,
				},
			});
		}
	}
}

async function syncRoles(db: DbClient): Promise<Record<string, Role>> {
	const roles: Record<string, Role> = {};

	for (const roleData of roleSeedData) {
		roles[roleData.name] = await db.role.upsert({
			where: { name: roleData.name },
			update: {
				displayName: roleData.displayName,
				description: roleData.description,
				isSystem: roleData.isSystem,
				removedAt: null,
			},
			create: {
				name: roleData.name,
				displayName: roleData.displayName,
				description: roleData.description,
				isSystem: roleData.isSystem,
			},
		});
	}

	return roles;
}

async function syncRoleCategories(db: DbClient): Promise<void> {
	for (const categoryData of roleCategorySeedData) {
		const roleCategoryEnum = categoryData.roleCategoryEnum;

		await db.category.upsert({
			where: { name: roleCategoryEnum.name },
			update: {
				type: categoryData.type as CategoryTypes,
				spaceId: SYSTEM_SPACE_ID,
				removedAt: null,
			},
			create: {
				name: roleCategoryEnum.name,
				type: categoryData.type as CategoryTypes,
				spaceId: SYSTEM_SPACE_ID,
			},
		});
	}
}

async function syncRoleClassifications(
	db: DbClient,
	roles: Record<string, Role>,
): Promise<void> {
	for (const classificationData of roleClassificationSeedData) {
		const role = roles[classificationData.roleName];
		if (!role) {
			throw new Error(
				`Missing seeded role for classification: ${classificationData.roleName}`,
			);
		}

		const category = await db.category.findUnique({
			where: {
				name: classificationData.roleCategoryEnum.name,
			},
		});

		if (!category) {
			throw new Error(
				`Missing role category for classification: ${classificationData.roleCategoryEnum.name}`,
			);
		}

		await db.roleClassification.upsert({
			where: { roleId: role.id },
			update: {
				categoryId: category.id,
				removedAt: null,
			},
			create: {
				roleId: role.id,
				categoryId: category.id,
			},
		});
	}
}

async function syncRoleGroups(
	db: DbClient,
): Promise<Record<string, Group>> {
	const groups: Record<string, Group> = {};

	for (const groupData of roleGroupSeedData) {
		const roleGroupEnum = groupData.roleGroupEnum;
		let group = await db.group.findFirst({
			where: {
				name: roleGroupEnum.name,
				type: "Role",
				spaceId: SYSTEM_SPACE_ID,
			},
		});

		if (!group) {
			group = await db.group.create({
				data: {
					name: roleGroupEnum.name,
					type: "Role",
					spaceId: SYSTEM_SPACE_ID,
				},
			});
		} else if (group.removedAt) {
			group = await db.group.update({
				where: { id: group.id },
				data: { removedAt: null },
			});
		}

		groups[roleGroupEnum.code] = group;
	}

	return groups;
}

async function syncRoleAssociations(
	db: DbClient,
	roles: Record<string, Role>,
	groups: Record<string, Group>,
): Promise<void> {
	for (const associationData of roleAssociationSeedData) {
		const role = roles[associationData.roleName];
		const group = groups[associationData.roleGroupEnum.code];

		if (!role) {
			throw new Error(
				`Missing seeded role for association: ${associationData.roleName}`,
			);
		}
		if (!group) {
			throw new Error(
				`Missing seeded role group for association: ${associationData.roleGroupEnum.code}`,
			);
		}

		await db.roleAssociation.upsert({
			where: { roleId: role.id },
			update: {
				groupId: group.id,
				removedAt: null,
			},
			create: {
				roleId: role.id,
				groupId: group.id,
			},
		});
	}
}

async function syncSubjects(db: DbClient): Promise<Record<string, Subject>> {
	const subjects: Record<string, Subject> = {};

	for (const subjectData of subjectSeedData) {
		subjects[subjectData.name] = await db.subject.upsert({
			where: { name: subjectData.name },
			update: {
				displayName: subjectData.displayName,
				group: subjectData.group,
				order: subjectData.order ?? 0,
				isSystem: subjectData.isSystem ?? false,
				removedAt: null,
			},
			create: {
				name: subjectData.name,
				displayName: subjectData.displayName,
				group: subjectData.group,
				order: subjectData.order ?? 0,
				isSystem: subjectData.isSystem ?? false,
			},
		});
	}

	return subjects;
}

async function syncActions(db: DbClient): Promise<Record<string, Action>> {
	const actions: Record<string, Action> = {};

	for (const actionData of actionSeedData) {
		actions[actionData.name] = await db.action.upsert({
			where: { name: actionData.name },
			update: {
				displayName: actionData.displayName,
				description: actionData.description,
				group: actionData.group,
				order: actionData.order ?? 0,
				isSystem: actionData.isSystem ?? true,
				config: actionData.config
					? (actionData.config as unknown as Prisma.InputJsonObject)
					: Prisma.JsonNull,
				removedAt: null,
			},
			create: {
				name: actionData.name,
				displayName: actionData.displayName,
				description: actionData.description,
				group: actionData.group,
				order: actionData.order ?? 0,
				isSystem: actionData.isSystem ?? true,
				config: actionData.config
					? (actionData.config as unknown as Prisma.InputJsonObject)
					: Prisma.JsonNull,
			},
		});
	}

	return actions;
}

function getAbilityName(
	abilityData: (typeof abilitySeedData)[number],
	action: Action,
	subject: Subject,
): string {
	return (
		abilityData.name ??
		`${abilityData.inverted ? "Cannot" : "Can"} ${action.displayName} ${subject.displayName}`
	);
}

async function syncAbilitiesAndGrants(
	db: DbClient,
	roles: Record<string, Role>,
	subjects: Record<string, Subject>,
	actions: Record<string, Action>,
): Promise<void> {
	const abilityMap = new Map<string, { id: string }>();

	for (const abilityData of abilitySeedData) {
		const subject = subjects[abilityData.subject];
		const action = actions[abilityData.actionName];

		if (!subject || !action) {
			throw new Error(
				`Missing subject/action for ability: ${abilityData.subject} / ${abilityData.actionName}`,
			);
		}

		const abilityKey = `${subject.id}:${action.id}:${abilityData.inverted}:${JSON.stringify(abilityData.conditions ?? null)}`;
		if (!abilityMap.has(abilityKey)) {
			const abilityName = getAbilityName(abilityData, action, subject);
			const ability = await db.ability.upsert({
				where: { name: abilityName },
				update: {
					description: abilityData.description,
					subjectId: subject.id,
					actionId: action.id,
					fields: [],
					conditions: abilityData.conditions
						? (abilityData.conditions as Prisma.InputJsonObject)
						: Prisma.JsonNull,
					inverted: abilityData.inverted,
					reason: abilityData.reason ?? null,
					removedAt: null,
				},
				create: {
					name: abilityName,
					description: abilityData.description,
					subjectId: subject.id,
					actionId: action.id,
					fields: [],
					conditions: abilityData.conditions
						? (abilityData.conditions as Prisma.InputJsonObject)
						: Prisma.JsonNull,
					inverted: abilityData.inverted,
					reason: abilityData.reason ?? null,
				},
			});
			abilityMap.set(abilityKey, { id: ability.id });
		}
	}

	for (const abilityData of abilitySeedData) {
		const role = roles[abilityData.roleName];
		const subject = subjects[abilityData.subject];
		const action = actions[abilityData.actionName];

		if (!role || !subject || !action) {
			throw new Error(
				`Missing role/subject/action for grant: ${abilityData.roleName} / ${abilityData.subject} / ${abilityData.actionName}`,
			);
		}

		const abilityKey = `${subject.id}:${action.id}:${abilityData.inverted}:${JSON.stringify(abilityData.conditions ?? null)}`;
		const ability = abilityMap.get(abilityKey);

		if (!ability) {
			throw new Error(`Missing ability mapping for key: ${abilityKey}`);
		}

		await db.grant.upsert({
			where: {
				granteeType_granteeId_abilityId: {
					granteeType: "Role",
					granteeId: role.id,
					abilityId: ability.id,
				},
			},
			update: {
				isActive: abilityData.isActive ?? true,
				priority: abilityData.priority ?? 0,
				removedAt: null,
			},
			create: {
				granteeType: "Role",
				granteeId: role.id,
				abilityId: ability.id,
				isActive: abilityData.isActive ?? true,
				priority: abilityData.priority ?? 0,
			},
		});
	}
}

async function syncTranslations(db: DbClient): Promise<void> {
	for (const translation of translationSeedData) {
		await db.translation.upsert({
			where: {
				languageCode_key: {
					languageCode: translation.languageCode,
					key: translation.key,
				},
			},
			update: {
				text: translation.text,
				category: translation.category,
				isTranslated: translation.isTranslated,
			},
			create: translation,
		});
	}
}

async function syncOidcClients(db: DbClient): Promise<void> {
	for (const clientData of oidcClientSeedData) {
		await db.oidcClient.upsert({
			where: { clientId: clientData.clientId },
			update: {
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
				removedAt: null,
			},
			create: {
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
	}
}

export async function syncReferenceData(
	db: DbClient,
): Promise<ReferenceDataSyncResult> {
	console.log("Reference data sync 시작...");

	await ensureSystemSpace(db);
	await syncSpaceCategories(db);
	await syncSpaceGroups(db);

	const roles = await syncRoles(db);
	await syncRoleCategories(db);
	await syncRoleClassifications(db, roles);
	const groups = await syncRoleGroups(db);
	await syncRoleAssociations(db, roles, groups);

	const subjects = await syncSubjects(db);
	const actions = await syncActions(db);
	await syncAbilitiesAndGrants(db, roles, subjects, actions);
	await syncTranslations(db);
	await syncOidcClients(db);

	console.log("Reference data sync 완료!");
	return { roles };
}
