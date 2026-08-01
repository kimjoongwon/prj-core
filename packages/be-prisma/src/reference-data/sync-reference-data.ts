import { ensureSystemAdminUsers } from "../bootstrap/system-admins";
import type {
	Action,
	Group,
	PrismaClient,
	Role,
	Subject,
} from "../generated/client/client";
import { Prisma } from "../generated/client/client";
import { CategoryTypes } from "../generated/client/enums";
import { SYSTEM_SPACE_ID } from "./constants";
import {
	abilitySeedData,
	actionSeedData,
	legacyOidcClientIds,
	obsoleteTranslationSeedKeys,
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
} from "./definitions";

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface ReferenceDataSyncResult {
	roles: Record<string, Role>;
}
/**
 * reference-data가 의존하는 고정 system space row를 보장합니다.
 *
 * taxonomy/group/role 분류가 모두 이 space를 기준으로 매달리므로,
 * 실제 동기화는 항상 이 row 존재를 전제로 시작합니다.
 */
async function ensureSystemSpace(db: DbClient): Promise<void> {
	// Reference data owns the canonical system space row because other catalogs
	// (taxonomy, groups, roles) hang from it.
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

async function ensureSystemTenant(db: DbClient, roles: Record<string, Role>) {
	const platformAdminRole = roles.PLATFORM_ADMIN;
	if (!platformAdminRole) {
		throw new Error("PLATFORM_ADMIN role is required for system tenant.");
	}

	await ensureSystemAdminUsers(db, platformAdminRole.id);

	const systemTenant = await db.tenant.findFirst({
		where: {
			space: { id: SYSTEM_SPACE_ID },
			roleSeq: platformAdminRole.seq,
			removedAt: null,
		},
		orderBy: { createdAt: "asc" },
	});

	if (!systemTenant) {
		throw new Error("System tenant was not created.");
	}

	return systemTenant;
}

async function syncSpaceCategories(
	db: DbClient,
	systemSpaceSeq: number,
	createdBySeq: number,
): Promise<void> {
	const categoryMap = new Map<string, { seq: number }>();

	// Parent-child category links are resolved in memory as we upsert categories
	// in seed order, so later entries can refer to earlier category ids.
	for (const categoryData of spaceCategorySeedData) {
		const spaceCategoryEnum = categoryData.spaceCategoryEnum;
		const parentSeq = categoryData.parentCategoryCode
			? (categoryMap.get(categoryData.parentCategoryCode)?.seq ?? null)
			: null;

		const category = await db.category.upsert({
			where: { name: spaceCategoryEnum.name },
			update: {
				type: categoryData.type as CategoryTypes,
				spaceSeq: systemSpaceSeq,
				createdBySeq,
				parentSeq,
				removedAt: null,
			},
			create: {
				name: spaceCategoryEnum.name,
				type: categoryData.type as CategoryTypes,
				spaceSeq: systemSpaceSeq,
				createdBySeq,
				parentSeq,
			},
		});

		categoryMap.set(spaceCategoryEnum.code, { seq: category.seq });
	}

	const rootCategory = categoryMap.get("ROOT");
	if (!rootCategory) {
		throw new Error("ROOT space category seed was not created.");
	}

	await db.spaceClassification.upsert({
		where: { spaceSeq: systemSpaceSeq },
		update: {
			categorySeq: rootCategory.seq,
			removedAt: null,
		},
		create: {
			spaceSeq: systemSpaceSeq,
			categorySeq: rootCategory.seq,
		},
	});
}

async function syncSpaceGroups(
	db: DbClient,
	systemSpaceSeq: number,
	createdBySeq: number,
): Promise<void> {
	// Group rows do not have a single natural unique key for this lookup shape,
	// so we restore/create them and then ensure the space association exists.
	for (const groupData of spaceGroupSeedData) {
		const spaceGroupEnum = groupData.spaceGroupEnum;
		let group = await db.group.findFirst({
			where: {
				name: spaceGroupEnum.name,
				type: "Space",
				spaceSeq: systemSpaceSeq,
			},
		});

		if (!group) {
			group = await db.group.create({
				data: {
					name: spaceGroupEnum.name,
					type: "Space",
					spaceSeq: systemSpaceSeq,
					createdBySeq,
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
				spaceSeq: systemSpaceSeq,
				groupSeq: group.seq,
			},
		});

		if (!existingAssociation) {
			await db.spaceAssociation.create({
				data: {
					spaceSeq: systemSpaceSeq,
					groupSeq: group.seq,
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

async function syncRoleCategories(
	db: DbClient,
	systemSpaceSeq: number,
	createdBySeq: number,
): Promise<void> {
	for (const categoryData of roleCategorySeedData) {
		const roleCategoryEnum = categoryData.roleCategoryEnum;

		await db.category.upsert({
			where: { name: roleCategoryEnum.name },
			update: {
				type: categoryData.type as CategoryTypes,
				spaceSeq: systemSpaceSeq,
				createdBySeq,
				removedAt: null,
			},
			create: {
				name: roleCategoryEnum.name,
				type: categoryData.type as CategoryTypes,
				spaceSeq: systemSpaceSeq,
				createdBySeq,
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
			where: { roleSeq: role.seq },
			update: {
				categorySeq: category.seq,
				removedAt: null,
			},
			create: {
				roleSeq: role.seq,
				categorySeq: category.seq,
			},
		});
	}
}

async function syncRoleGroups(
	db: DbClient,
	systemSpaceSeq: number,
	createdBySeq: number,
): Promise<Record<string, Group>> {
	const groups: Record<string, Group> = {};

	for (const groupData of roleGroupSeedData) {
		const roleGroupEnum = groupData.roleGroupEnum;
		let group = await db.group.findFirst({
			where: {
				name: roleGroupEnum.name,
				type: "Role",
				spaceSeq: systemSpaceSeq,
			},
		});

		if (!group) {
			group = await db.group.create({
				data: {
					name: roleGroupEnum.name,
					type: "Role",
					spaceSeq: systemSpaceSeq,
					createdBySeq,
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
			where: { roleSeq: role.seq },
			update: {
				groupSeq: group.seq,
				removedAt: null,
			},
			create: {
				roleSeq: role.seq,
				groupSeq: group.seq,
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

/**
 * ability의 표시 이름을 결정합니다.
 *
 * seed에 명시적 `name`이 없으면 action/subject 조합에서 사람이 읽을 수 있는
 * 기본 이름을 만들어 unique key처럼 사용합니다.
 */
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

function getSystemPolicyName(roleName: string): string {
	return `${roleName.toLowerCase().replaceAll("_", "-")}-system-policy`;
}

async function syncAbilitiesAndPolicies(
	db: DbClient,
	roles: Record<string, Role>,
	subjects: Record<string, Subject>,
	actions: Record<string, Action>,
): Promise<void> {
	const abilityMap = new Map<string, { id: string; seq: number }>();

	// Phase 1: materialize unique ability records. Multiple roles may point to
	// the same subject/action/condition combination.
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
					subjectSeq: subject.seq,
					actionSeq: action.seq,
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
					subjectSeq: subject.seq,
					actionSeq: action.seq,
					fields: [],
					conditions: abilityData.conditions
						? (abilityData.conditions as Prisma.InputJsonObject)
						: Prisma.JsonNull,
					inverted: abilityData.inverted,
					reason: abilityData.reason ?? null,
				},
			});
			abilityMap.set(abilityKey, { id: ability.id, seq: ability.seq });
		}
	}

	const activeTenants = await db.tenant.findMany({
		where: { removedAt: null },
		select: { spaceSeq: true, userSeq: true },
	});
	const policyScopes = Array.from(
		new Map(activeTenants.map((tenant) => [tenant.spaceSeq, tenant])).values(),
	);

	const abilitySeqsByRoleName = new Map<string, Set<number>>();
	const priorityByRoleName = new Map<string, number>();

	for (const abilityData of abilitySeedData) {
		if (abilityData.isActive === false) {
			continue;
		}

		const role = roles[abilityData.roleName];
		const subject = subjects[abilityData.subject];
		const action = actions[abilityData.actionName];

		if (!role || !subject || !action) {
			throw new Error(
				`Missing role/subject/action for role policy: ${abilityData.roleName} / ${abilityData.subject} / ${abilityData.actionName}`,
			);
		}

		const abilityKey = `${subject.id}:${action.id}:${abilityData.inverted}:${JSON.stringify(abilityData.conditions ?? null)}`;
		const ability = abilityMap.get(abilityKey);

		if (!ability) {
			throw new Error(`Missing ability mapping for key: ${abilityKey}`);
		}

		const abilitySeqs =
			abilitySeqsByRoleName.get(abilityData.roleName) ?? new Set<number>();
		abilitySeqs.add(ability.seq);
		abilitySeqsByRoleName.set(abilityData.roleName, abilitySeqs);

		const currentPriority = priorityByRoleName.get(abilityData.roleName) ?? 0;
		priorityByRoleName.set(
			abilityData.roleName,
			Math.max(currentPriority, abilityData.priority ?? 0),
		);
	}

	// Phase 2: create system policies per active tenant and assign them to roles.
	for (const [roleName, abilitySeqs] of abilitySeqsByRoleName.entries()) {
		const role = roles[roleName];
		if (!role) {
			throw new Error(`Missing role for policy seed: ${roleName}`);
		}

		const policyName = getSystemPolicyName(roleName);

		for (const scope of policyScopes) {
			const policy = await db.policy.upsert({
				where: {
					spaceSeq_name: {
						spaceSeq: scope.spaceSeq,
						name: policyName,
					},
				},
				update: {
					displayName: `${role.displayName ?? role.name} 기본 정책`,
					description: `${role.displayName ?? role.name} 역할에 자동 할당되는 시스템 권한 정책입니다.`,
					isSystem: true,
					removedAt: null,
				},
				create: {
					spaceSeq: scope.spaceSeq,
					createdBySeq: scope.userSeq,
					name: policyName,
					displayName: `${role.displayName ?? role.name} 기본 정책`,
					description: `${role.displayName ?? role.name} 역할에 자동 할당되는 시스템 권한 정책입니다.`,
					isSystem: true,
				},
			});

			const abilitySeqList = Array.from(abilitySeqs);
			await db.policyEntry.updateMany({
				where: {
					policySeq: policy.seq,
					removedAt: null,
					abilitySeq: { notIn: abilitySeqList },
				},
				data: { removedAt: new Date() },
			});

			for (const abilitySeq of abilitySeqList) {
				await db.policyEntry.upsert({
					where: {
						policySeq_abilitySeq: {
							policySeq: policy.seq,
							abilitySeq,
						},
					},
					update: { removedAt: null },
					create: {
						policySeq: policy.seq,
						abilitySeq,
					},
				});
			}

			await db.roleAssignment.upsert({
				where: {
					roleSeq_policySeq: {
						roleSeq: role.seq,
						policySeq: policy.seq,
					},
				},
				update: {
					isActive: true,
					priority: priorityByRoleName.get(roleName) ?? 0,
					removedAt: null,
				},
				create: {
					roleSeq: role.seq,
					policySeq: policy.seq,
					isActive: true,
					priority: priorityByRoleName.get(roleName) ?? 0,
				},
			});
		}
	}
}

async function syncTranslations(db: DbClient): Promise<void> {
	const activeSeedKeys = new Set(
		translationSeedData.map((translation) => translation.key),
	);
	const obsoleteSeedKeys = obsoleteTranslationSeedKeys.filter(
		(key) => !activeSeedKeys.has(key),
	);

	if (obsoleteSeedKeys.length > 0) {
		await db.translation.deleteMany({
			where: {
				key: { in: [...obsoleteSeedKeys] },
			},
		});
	}

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
	if (legacyOidcClientIds.length > 0) {
		await db.oidcClient.updateMany({
			where: {
				clientId: {
					in: [...legacyOidcClientIds],
				},
				removedAt: null,
			},
			data: {
				isActive: false,
				removedAt: new Date(),
			},
		});
	}

	for (const clientData of oidcClientSeedData) {
		const loginUi =
			clientData.loginUi === undefined || clientData.loginUi === null
				? Prisma.DbNull
				: (clientData.loginUi as Prisma.InputJsonValue);

		await db.oidcClient.upsert({
			where: { clientId: clientData.clientId },
			update: {
				clientSecret: clientData.clientSecret,
				name: clientData.name,
				redirectUris: clientData.redirectUris,
				loginUrl: clientData.loginUrl ?? null,
				defaultReturnTo: clientData.defaultReturnTo ?? null,
				grantTypes: clientData.grantTypes,
				responseTypes: clientData.responseTypes,
				tokenEndpointAuthMethod: clientData.tokenEndpointAuthMethod,
				scope: clientData.scope,
				isActive: clientData.isActive,
				isFirstParty: clientData.isFirstParty ?? false,
				skipConsent: clientData.skipConsent ?? false,
				loginUi,
				logoUri: clientData.logoUri ?? null,
				policyUri: clientData.policyUri ?? null,
				tosUri: clientData.tosUri ?? null,
				removedAt: null,
			},
			create: {
				clientId: clientData.clientId,
				clientSecret: clientData.clientSecret,
				name: clientData.name,
				redirectUris: clientData.redirectUris,
				loginUrl: clientData.loginUrl ?? null,
				defaultReturnTo: clientData.defaultReturnTo ?? null,
				grantTypes: clientData.grantTypes,
				responseTypes: clientData.responseTypes,
				tokenEndpointAuthMethod: clientData.tokenEndpointAuthMethod,
				scope: clientData.scope,
				isActive: clientData.isActive,
				isFirstParty: clientData.isFirstParty ?? false,
				skipConsent: clientData.skipConsent ?? false,
				loginUi,
				logoUri: clientData.logoUri ?? null,
				policyUri: clientData.policyUri ?? null,
				tosUri: clientData.tosUri ?? null,
			},
		});
	}
}

/**
 * 운영 기준 데이터를 한 번에 동기화합니다.
 *
 * 이 함수는 "처음 세팅"뿐 아니라 재실행도 전제로 합니다. 대부분의 row는 upsert 또는
 * soft-delete 복구 방식으로 처리되며, 실행 순서는 id 참조 관계를 반영해 고정합니다.
 */
export async function syncReferenceData(
	db: DbClient,
): Promise<ReferenceDataSyncResult> {
	console.log("Reference data sync 시작...");

	// Execution order matters because later catalogs depend on ids created by
	// earlier ones, especially system space -> taxonomy -> roles -> policies.
	await ensureSystemSpace(db);
	const roles = await syncRoles(db);
	const systemTenant = await ensureSystemTenant(db, roles);

	await syncSpaceCategories(db, systemTenant.spaceSeq, systemTenant.userSeq);
	await syncSpaceGroups(db, systemTenant.spaceSeq, systemTenant.userSeq);
	await syncRoleCategories(db, systemTenant.spaceSeq, systemTenant.userSeq);
	await syncRoleClassifications(db, roles);
	const groups = await syncRoleGroups(
		db,
		systemTenant.spaceSeq,
		systemTenant.userSeq,
	);
	await syncRoleAssociations(db, roles, groups);

	const subjects = await syncSubjects(db);
	const actions = await syncActions(db);
	await syncAbilitiesAndPolicies(db, roles, subjects, actions);
	await syncTranslations(db);
	await syncOidcClients(db);

	console.log("Reference data sync 완료!");
	return { roles };
}
