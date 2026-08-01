import type { Action, Role, Subject } from "../../generated/client/client";
import { Prisma } from "../../generated/client/client";
import {
	adminFullAccessAbilitySeedData,
	adminMenuSubjectSeedData,
	adminPageSubjectSeedData,
	legacyAdminMenuSubjectNames,
	legacyAdminPageSubjectNames,
} from "../definitions/admin-permissions";
import type { ReferenceDataDbClient, ReferenceDataMigration } from "./types";

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
		new Set(
			adminFullAccessAbilitySeedData.map((ability) => ability.actionName),
		),
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
	const abilitySeqs = new Set<number>();

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
				subjectSeq: subject.seq,
				actionSeq: action.seq,
				fields: [],
				conditions: Prisma.JsonNull,
				inverted: seed.inverted,
				reason: null,
				removedAt: null,
			},
			create: {
				name: buildAbilityName(action, subject, seed.inverted),
				description: seed.description,
				subjectSeq: subject.seq,
				actionSeq: action.seq,
				fields: [],
				conditions: Prisma.JsonNull,
				inverted: seed.inverted,
				reason: null,
			},
		});

		abilitySeqs.add(ability.seq);
	}

	const activeTenants = await db.tenant.findMany({
		where: { removedAt: null },
		select: { spaceSeq: true, userSeq: true },
	});
	const policyScopes = Array.from(
		new Map(activeTenants.map((tenant) => [tenant.spaceSeq, tenant])).values(),
	);

	for (const scope of policyScopes) {
		const policy = await db.policy.upsert({
			where: {
				spaceSeq_name: {
					spaceSeq: scope.spaceSeq,
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
				spaceSeq: scope.spaceSeq,
				createdBySeq: scope.userSeq,
				name: buildSystemPolicyName(role.name),
				displayName: `${role.displayName ?? role.name} 기본 정책`,
				description:
					"관리자 메뉴/화면 기준 데이터가 포함된 시스템 권한 정책입니다.",
				isSystem: true,
			},
		});

		for (const abilitySeq of abilitySeqs) {
			await db.policyEntry.upsert({
				where: {
					policySeq_abilitySeq: {
						policySeq: policy.seq,
						abilitySeq,
					},
				},
				update: {
					removedAt: null,
				},
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
				priority: 0,
				removedAt: null,
			},
			create: {
				roleSeq: role.seq,
				policySeq: policy.seq,
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
		select: { id: true, seq: true },
	});

	if (legacySubjects.length === 0) {
		return;
	}

	const removedAt = new Date();
	const legacySubjectIds = legacySubjects.map((subject) => subject.id);
	const legacySubjectSeqs = legacySubjects.map((subject) => subject.seq);
	const legacyAbilities = await db.ability.findMany({
		where: {
			subjectSeq: { in: legacySubjectSeqs },
		},
		select: { id: true, seq: true },
	});
	const legacyAbilityIds = legacyAbilities.map((ability) => ability.id);
	const legacyAbilitySeqs = legacyAbilities.map((ability) => ability.seq);

	if (legacyAbilityIds.length > 0) {
		await db.policyEntry.updateMany({
			where: {
				abilitySeq: { in: legacyAbilitySeqs },
				removedAt: null,
			},
			data: {
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
