import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataDbClient, ReferenceDataMigration } from "./types";

const LEGACY_SUBJECT_NAME = "entity:Ground";
const CANONICAL_SUBJECT_NAME = "entity:FitnessCenter";
const LEGACY_TRANSLATION_PREFIX_PAIRS: ReadonlyArray<
	readonly [string, string]
> = [
	["common.ground.", "common.fitnessCenter."],
	["menu.grounds.", "menu.fitnessCenters."],
];
const LEGACY_TEMPLATE_TOKEN_PAIRS: ReadonlyArray<readonly [string, string]> = [
	["groundName", "fitnessCenterName"],
	["groundPhone", "fitnessCenterPhone"],
];

/**
 * 저장된 템플릿 문자열에서 이전 변수 토큰을 새 변수 토큰으로 치환합니다.
 */
function replaceLegacyTemplateTokens(value: string): string {
	return LEGACY_TEMPLATE_TOKEN_PAIRS.reduce(
		(result, [legacyToken, canonicalToken]) =>
			result.split(legacyToken).join(canonicalToken),
		value,
	);
}

function buildFitnessCenterAbilityName(
	actionDisplayName: string,
	subjectDisplayName: string,
	inverted: boolean,
) {
	return `${inverted ? "Cannot" : "Can"} ${actionDisplayName} ${subjectDisplayName}`;
}

async function migrateLegacySubject(db: ReferenceDataDbClient) {
	const [legacySubject, canonicalSubject] = await Promise.all([
		db.subject.findUnique({
			where: { name: LEGACY_SUBJECT_NAME },
		}),
		db.subject.findUnique({
			where: { name: CANONICAL_SUBJECT_NAME },
		}),
	]);

	if (legacySubject && canonicalSubject) {
		throw new Error(
			`Cannot migrate subject name: both legacy and canonical subject rows exist (${LEGACY_SUBJECT_NAME}, ${CANONICAL_SUBJECT_NAME}). Resolve manually.`,
		);
	}

	const targetSubject =
		legacySubject ??
		(canonicalSubject
			? {
					...canonicalSubject,
				}
			: null);

	if (!targetSubject) {
		return null;
	}

	if (legacySubject) {
		await db.subject.update({
			where: { id: legacySubject.id },
			data: {
				name: CANONICAL_SUBJECT_NAME,
				displayName: "피트니스센터",
				isSystem: true,
				removedAt: null,
			},
		});
	}

	if (canonicalSubject) {
		await db.subject.update({
			where: { id: canonicalSubject.id },
			data: {
				isSystem: true,
				removedAt: null,
			},
		});
	}

	return await db.subject.findUniqueOrThrow({
		where: { name: CANONICAL_SUBJECT_NAME },
	});
}

async function migrateFitnessCenterAbilityNames(
	db: ReferenceDataDbClient,
	fitnessCenterSubjectSeq: number,
): Promise<void> {
	const abilities = await db.ability.findMany({
		where: {
			subjectSeq: fitnessCenterSubjectSeq,
		},
		include: {
			action: true,
		},
	});

	const subject = await db.subject.findUniqueOrThrow({
		where: { seq: fitnessCenterSubjectSeq },
	});

	for (const ability of abilities) {
		const expectedName = buildFitnessCenterAbilityName(
			ability.action.displayName,
			subject.displayName,
			ability.inverted,
		);

		if (ability.name === expectedName) {
			continue;
		}

		const collision = await db.ability.findFirst({
			where: {
				name: expectedName,
				id: { not: ability.id },
			},
			select: { id: true },
		});

		if (collision) {
			throw new Error(
				`Cannot migrate ability name for legacy ground terminology: collision on "${expectedName}"`,
			);
		}

		await db.ability.update({
			where: { id: ability.id },
			data: {
				name: expectedName,
				subjectSeq: fitnessCenterSubjectSeq,
				removedAt: null,
			},
		});
	}
}

async function migrateLegacyTranslationKeys(
	db: ReferenceDataDbClient,
): Promise<void> {
	const legacyTranslations = await db.translation.findMany({
		where: {
			OR: LEGACY_TRANSLATION_PREFIX_PAIRS.map(([legacyPrefix]) => ({
				key: { startsWith: legacyPrefix },
			})),
		},
		orderBy: [{ key: "asc" }, { languageCode: "asc" }],
	});

	for (const legacyTranslation of legacyTranslations) {
		const prefixPair = LEGACY_TRANSLATION_PREFIX_PAIRS.find(([legacyPrefix]) =>
			legacyTranslation.key.startsWith(legacyPrefix),
		);
		if (!prefixPair) {
			continue;
		}

		const [legacyPrefix, canonicalPrefix] = prefixPair;
		const canonicalKey = `${canonicalPrefix}${legacyTranslation.key.slice(legacyPrefix.length)}`;
		const collision = await db.translation.findUnique({
			where: {
				languageCode_key: {
					languageCode: legacyTranslation.languageCode,
					key: canonicalKey,
				},
			},
			select: { id: true },
		});

		if (collision && collision.id !== legacyTranslation.id) {
			throw new Error(
				`Cannot migrate translation key: both legacy and canonical rows exist (${legacyTranslation.key}, ${canonicalKey}, ${legacyTranslation.languageCode}). Resolve manually.`,
			);
		}

		await db.translation.update({
			where: { id: legacyTranslation.id },
			data: { key: canonicalKey },
		});
	}
}

async function migrateLegacyTemplateTokens(
	db: ReferenceDataDbClient,
): Promise<void> {
	const templates = await db.template.findMany({
		select: {
			id: true,
			subject: true,
			content: true,
		},
	});

	for (const template of templates) {
		const subject = template.subject
			? replaceLegacyTemplateTokens(template.subject)
			: null;
		const content = replaceLegacyTemplateTokens(template.content);

		if (subject !== template.subject || content !== template.content) {
			await db.template.update({
				where: { id: template.id },
				data: { subject, content },
			});
		}
	}

	const variables = await db.templateVariable.findMany({
		where: {
			name: {
				in: LEGACY_TEMPLATE_TOKEN_PAIRS.map(([legacyToken]) => legacyToken),
			},
		},
		orderBy: [{ templateSeq: "asc" }, { name: "asc" }],
	});

	for (const variable of variables) {
		const tokenPair = LEGACY_TEMPLATE_TOKEN_PAIRS.find(
			([legacyToken]) => variable.name === legacyToken,
		);
		if (!tokenPair) {
			continue;
		}

		const [, canonicalToken] = tokenPair;
		const collision = await db.templateVariable.findUnique({
			where: {
				templateSeq_name: {
					templateSeq: variable.templateSeq,
					name: canonicalToken,
				},
			},
			select: { id: true },
		});

		if (collision && collision.id !== variable.id) {
			throw new Error(
				`Cannot migrate template variable: both legacy and canonical rows exist (${variable.name}, ${canonicalToken}, templateSeq=${variable.templateSeq}). Resolve manually.`,
			);
		}

		await db.templateVariable.update({
			where: { id: variable.id },
			data: {
				name: canonicalToken,
				defaultValue: variable.defaultValue
					? replaceLegacyTemplateTokens(variable.defaultValue)
					: null,
			},
		});
	}
}

export const fitnessCenterTerminologyMigration: ReferenceDataMigration = {
	id: "20260725121000_fitness-center-terminology",
	description:
		"Rename legacy fitness-center terminology in reference data and stored templates.",
	sourcePath: __filename,
	async up(db) {
		const subject = await migrateLegacySubject(db);
		if (subject) {
			await migrateFitnessCenterAbilityNames(db, subject.seq);
		}

		await migrateLegacyTranslationKeys(db);
		await migrateLegacyTemplateTokens(db);
		await syncReferenceData(db);
	},
};
