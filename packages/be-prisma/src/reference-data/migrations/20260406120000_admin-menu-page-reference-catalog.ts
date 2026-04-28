import { Prisma } from "../../generated/client/client";
import type {
	Action,
	Role,
	Subject,
} from "../../generated/client/client";
import {
	adminFullAccessAbilitySeedData,
	adminMenuSubjectSeedData,
	adminPageSubjectSeedData,
	legacyAdminMenuSubjectNames,
	legacyAdminPageSubjectNames,
} from "../definitions/admin-permissions";
import type { ReferenceDataMigration, ReferenceDataDbClient } from "./types";

const CURRENT_ADMIN_SUBJECT_SEED_DATA = [
	...adminMenuSubjectSeedData,
	...adminPageSubjectSeedData,
];

const LEGACY_ADMIN_SUBJECT_NAMES = [
	...legacyAdminMenuSubjectNames,
	...legacyAdminPageSubjectNames,
];

function buildAbilityName(action: Action, subject: Subject, inverted: boolean) {
	const actionDisplayName = action.displayName ?? action.name;
	const subjectDisplayName = subject.displayName ?? subject.name;
	return `${inverted ? "Cannot" : "Can"} ${actionDisplayName} ${subjectDisplayName}`;
}

function buildSystemPolicyName(roleName: string) {
	return `${roleName.toLowerCase().replaceAll("_", "-")}-system-policy`;
}

async function ensureCurrentAdminSubjects(
	db: ReferenceDataDbClient,
): Promise<Map<string, Subject>> {
	const subjects = new Map<string, Subject>();

	for (const seed of CURRENT_ADMIN_SUBJECT_SEED_DATA) {
		const subject = await db.subject.upsert({
			where: { name: seed.name },
			update: {
				displayName: seed.displayName,
				group: seed.group,
				order: seed.order,
				isSystem: seed.isSystem,
				removedAt: null,
			},
			create: {
				name: seed.name,
				displayName: seed.displayName,
				group: seed.group,
				order: seed.order,
				isSystem: seed.isSystem,
			},
		});

		subjects.set(seed.name, subject);
	}

	return subjects;
}

async function readRequiredActions(
	db: ReferenceDataDbClient,
): Promise<Map<string, Action>> {
	const requiredActionNames = Array.from(
		new Set(adminFullAccessAbilitySeedData.map((ability) => ability.actionName)),
	);
	const actions = await db.action.findMany({
		where: { name: { in: requiredActionNames } },
	});
	const actionMap = new Map(actions.map((action) => [action.name, action]));

	for (const actionName of requiredActionNames) {
		if (!actionMap.has(actionName)) {
			throw new Error(
				`Missing admin reference-data action: ${actionName}. Run syncReferenceData() before this migration.`,
			);
		}
	}

	return actionMap;
}

async function readFullAccessRole(db: ReferenceDataDbClient): Promise<Role> {
	const role = await db.role.findUnique({
		where: { name: "FULL_ACCESS" },
	});

	if (!role) {
		throw new Error(
			"FULL_ACCESS role is required before syncing admin menu/page reference data.",
		);
	}

	return role;
}

async function ensureCurrentAdminFullAccessPolicies(
	db: ReferenceDataDbClient,
	role: Role,
	subjectMap: Map<string, Subject>,
	actionMap: Map<string, Action>,
): Promise<void> {
	const abilityIds = new Set<string>();

	for (const seed of adminFullAccessAbilitySeedData) {
		const subject = subjectMap.get(seed.subject);
		const action = actionMap.get(seed.actionName);

		if (!subject || !action) {
			throw new Error(
				`Missing subject/action while syncing admin reference data: ${seed.subject} / ${seed.actionName}`,
			);
		}

		const ability = await db.ability.upsert({
			where: { name: buildAbilityName(action, subject, seed.inverted) },
			update: {
				description: seed.description,
				subjectId: subject.id,
				actionId: action.id,
				fields: [],
				conditions: Prisma.JsonNull,
				inverted: seed.inverted,
				reason: null,
				removedAt: null,
			},
			create: {
				name: buildAbilityName(action, subject, seed.inverted),
				description: seed.description,
				subjectId: subject.id,
				actionId: action.id,
				fields: [],
				conditions: Prisma.JsonNull,
				inverted: seed.inverted,
				reason: null,
			},
		});

		abilityIds.add(ability.id);
	}

	const activeSpaces = await db.space.findMany({
		where: { removedAt: null },
		select: { id: true },
	});

	for (const space of activeSpaces) {
		const policy = await db.policy.upsert({
			where: {
				spaceId_name: {
					spaceId: space.id,
					name: buildSystemPolicyName(role.name),
				},
			},
			update: {
				displayName: `${role.displayName ?? role.name} 기본 정책`,
				description:
					"관리자 메뉴/화면 기준 데이터가 포함된 시스템 권한 정책입니다.",
				isSystem: true,
				removedAt: null,
			},
			create: {
				spaceId: space.id,
				name: buildSystemPolicyName(role.name),
				displayName: `${role.displayName ?? role.name} 기본 정책`,
				description:
					"관리자 메뉴/화면 기준 데이터가 포함된 시스템 권한 정책입니다.",
				isSystem: true,
			},
		});

		for (const abilityId of abilityIds) {
			await db.policyAbility.upsert({
				where: {
					policyId_abilityId: {
						policyId: policy.id,
						abilityId,
					},
				},
				update: {
					removedAt: null,
				},
				create: {
					policyId: policy.id,
					abilityId,
				},
			});
		}

		await db.rolePolicy.upsert({
			where: {
				roleId_policyId: {
					roleId: role.id,
					policyId: policy.id,
				},
			},
			update: {
				isActive: true,
				priority: 0,
				removedAt: null,
			},
			create: {
				roleId: role.id,
				policyId: policy.id,
				isActive: true,
				priority: 0,
			},
		});
	}
}

async function pruneLegacyAdminSubjects(
	db: ReferenceDataDbClient,
): Promise<void> {
	if (LEGACY_ADMIN_SUBJECT_NAMES.length === 0) {
		return;
	}

	const legacySubjects = await db.subject.findMany({
		where: {
			name: { in: LEGACY_ADMIN_SUBJECT_NAMES },
		},
		select: { id: true },
	});

	if (legacySubjects.length === 0) {
		return;
	}

	const removedAt = new Date();
	const legacySubjectIds = legacySubjects.map((subject) => subject.id);
	const legacyAbilities = await db.ability.findMany({
		where: {
			subjectId: { in: legacySubjectIds },
		},
		select: { id: true },
	});
	const legacyAbilityIds = legacyAbilities.map((ability) => ability.id);

	if (legacyAbilityIds.length > 0) {
		await db.policyAbility.updateMany({
			where: {
				abilityId: { in: legacyAbilityIds },
				removedAt: null,
			},
			data: {
				isActive: false,
				removedAt,
			},
		});

		await db.ability.updateMany({
			where: {
				id: { in: legacyAbilityIds },
				removedAt: null,
			},
			data: {
				removedAt,
			},
		});
	}

	await db.subject.updateMany({
		where: {
			id: { in: legacySubjectIds },
			removedAt: null,
		},
		data: {
			removedAt,
		},
	});
}

export const adminMenuPageReferenceCatalogMigration: ReferenceDataMigration = {
	id: "20260406120000_admin-menu-page-reference-catalog",
	description:
		"Sync current admin menu/page reference subjects and prune legacy admin menu/page permission data.",
	sourcePath: __filename,
	async up(db) {
		const subjectMap = await ensureCurrentAdminSubjects(db);
		const actionMap = await readRequiredActions(db);
		const fullAccessRole = await readFullAccessRole(db);

		await ensureCurrentAdminFullAccessPolicies(
			db,
			fullAccessRole,
			subjectMap,
			actionMap,
		);
		await pruneLegacyAdminSubjects(db);
	},
};
