import { beforeEach, describe, expect, it, vi } from "vitest";
import { syncReferenceData } from "../sync-reference-data";
import { fitnessCenterTerminologyMigration } from "./20260725121000_fitness-center-terminology";
import type { ReferenceDataDbClient } from "./types";

vi.mock("../sync-reference-data", () => ({
	syncReferenceData: vi.fn().mockResolvedValue({ roles: {} }),
}));

interface MutableSubject {
	id: string;
	name: string;
	displayName: string;
	isSystem: boolean;
	removedAt: Date | null;
}

interface MutableTranslation {
	id: string;
	languageCode: "ko_KR";
	key: string;
}

interface MutableTemplate {
	id: string;
	subject: string | null;
	content: string;
}

interface MutableTemplateVariable {
	id: string;
	templateId: string;
	name: string;
	defaultValue: string | null;
}

function createMigrationDb() {
	const subjects: MutableSubject[] = [
		{
			id: "subject-stable-id",
			name: "entity:Ground",
			displayName: "시설",
			isSystem: true,
			removedAt: null,
		},
	];
	const abilities = [
		{
			id: "ability-stable-id",
			name: "Can 조회 시설",
			subjectId: "subject-stable-id",
			inverted: false,
			removedAt: null as Date | null,
			action: { displayName: "조회" },
		},
	];
	const translations: MutableTranslation[] = [
		{
			id: "translation-common-id",
			languageCode: "ko_KR",
			key: "common.ground.list.success",
		},
		{
			id: "translation-menu-id",
			languageCode: "ko_KR",
			key: "menu.grounds.list",
		},
	];
	const templates: MutableTemplate[] = [
		{
			id: "template-stable-id",
			subject: "{{groundName}} 예약 안내",
			content: "{{groundName}} 문의는 {{groundPhone}}으로 연락하세요.",
		},
	];
	const variables: MutableTemplateVariable[] = [
		{
			id: "variable-name-id",
			templateId: "template-stable-id",
			name: "groundName",
			defaultValue: "{{groundName}}",
		},
		{
			id: "variable-phone-id",
			templateId: "template-stable-id",
			name: "groundPhone",
			defaultValue: null,
		},
	];

	const db = {
		subject: {
			findUnique: vi.fn(({ where: { name } }) =>
				Promise.resolve(
					subjects.find((subject) => subject.name === name) ?? null,
				),
			),
			findUniqueOrThrow: vi.fn(({ where: { id, name } }) => {
				const subject = subjects.find(
					(candidate) =>
						(id === undefined || candidate.id === id) &&
						(name === undefined || candidate.name === name),
				);
				if (!subject) {
					throw new Error("subject not found");
				}
				return Promise.resolve(subject);
			}),
			update: vi.fn(({ where: { id }, data }) => {
				const subject = subjects.find((candidate) => candidate.id === id);
				if (!subject) {
					throw new Error("subject not found");
				}
				Object.assign(subject, data);
				return Promise.resolve(subject);
			}),
		},
		ability: {
			findMany: vi.fn(({ where: { subjectId } }) =>
				Promise.resolve(
					abilities.filter((ability) => ability.subjectId === subjectId),
				),
			),
			findFirst: vi.fn(({ where: { name, id } }) =>
				Promise.resolve(
					abilities.find(
						(ability) => ability.name === name && ability.id !== id.not,
					) ?? null,
				),
			),
			update: vi.fn(({ where: { id }, data }) => {
				const ability = abilities.find((candidate) => candidate.id === id);
				if (!ability) {
					throw new Error("ability not found");
				}
				Object.assign(ability, data);
				return Promise.resolve(ability);
			}),
		},
		translation: {
			findMany: vi.fn(() =>
				Promise.resolve(
					translations.filter(
						(translation) =>
							translation.key.startsWith("common.ground.") ||
							translation.key.startsWith("menu.grounds."),
					),
				),
			),
			findUnique: vi.fn(({ where: { languageCode_key } }) =>
				Promise.resolve(
					translations.find(
						(translation) =>
							translation.languageCode === languageCode_key.languageCode &&
							translation.key === languageCode_key.key,
					) ?? null,
				),
			),
			update: vi.fn(({ where: { id }, data }) => {
				const translation = translations.find(
					(candidate) => candidate.id === id,
				);
				if (!translation) {
					throw new Error("translation not found");
				}
				Object.assign(translation, data);
				return Promise.resolve(translation);
			}),
		},
		template: {
			findMany: vi.fn(() => Promise.resolve(templates)),
			update: vi.fn(({ where: { id }, data }) => {
				const template = templates.find((candidate) => candidate.id === id);
				if (!template) {
					throw new Error("template not found");
				}
				Object.assign(template, data);
				return Promise.resolve(template);
			}),
		},
		templateVariable: {
			findMany: vi.fn(() =>
				Promise.resolve(
					variables.filter(
						(variable) =>
							variable.name === "groundName" || variable.name === "groundPhone",
					),
				),
			),
			findUnique: vi.fn(({ where: { templateId_name } }) =>
				Promise.resolve(
					variables.find(
						(variable) =>
							variable.templateId === templateId_name.templateId &&
							variable.name === templateId_name.name,
					) ?? null,
				),
			),
			update: vi.fn(({ where: { id }, data }) => {
				const variable = variables.find((candidate) => candidate.id === id);
				if (!variable) {
					throw new Error("template variable not found");
				}
				Object.assign(variable, data);
				return Promise.resolve(variable);
			}),
		},
	} as unknown as ReferenceDataDbClient;

	return { abilities, db, subjects, templates, translations, variables };
}

describe("fitness center terminology reference-data migration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("기존 ID를 유지하면서 권한·번역·템플릿 계약을 바꾸고 다시 실행해도 같은 결과를 유지한다", async () => {
		// Given
		const state = createMigrationDb();

		// When
		await fitnessCenterTerminologyMigration.up(state.db);
		await fitnessCenterTerminologyMigration.up(state.db);

		// Then
		expect(state.subjects).toEqual([
			expect.objectContaining({
				id: "subject-stable-id",
				name: "entity:FitnessCenter",
				displayName: "피트니스센터",
			}),
		]);
		expect(state.abilities).toEqual([
			expect.objectContaining({
				id: "ability-stable-id",
				name: "Can 조회 피트니스센터",
				subjectId: "subject-stable-id",
			}),
		]);
		expect(state.translations).toEqual([
			expect.objectContaining({
				id: "translation-common-id",
				key: "common.fitnessCenter.list.success",
			}),
			expect.objectContaining({
				id: "translation-menu-id",
				key: "menu.fitnessCenters.list",
			}),
		]);
		expect(state.templates).toEqual([
			{
				id: "template-stable-id",
				subject: "{{fitnessCenterName}} 예약 안내",
				content:
					"{{fitnessCenterName}} 문의는 {{fitnessCenterPhone}}으로 연락하세요.",
			},
		]);
		expect(state.variables).toEqual([
			expect.objectContaining({
				id: "variable-name-id",
				name: "fitnessCenterName",
				defaultValue: "{{fitnessCenterName}}",
			}),
			expect.objectContaining({
				id: "variable-phone-id",
				name: "fitnessCenterPhone",
			}),
		]);
		expect(syncReferenceData).toHaveBeenCalledTimes(2);
	});

	it("이전 Subject와 새 Subject가 함께 있으면 임의로 합치지 않고 중단한다", async () => {
		// Given
		const state = createMigrationDb();
		state.subjects.push({
			id: "canonical-subject-id",
			name: "entity:FitnessCenter",
			displayName: "피트니스센터",
			isSystem: true,
			removedAt: null,
		});

		// When & Then
		await expect(
			fitnessCenterTerminologyMigration.up(state.db),
		).rejects.toThrow("both legacy and canonical subject rows exist");
		expect(state.subjects[0]?.id).toBe("subject-stable-id");
		expect(syncReferenceData).not.toHaveBeenCalled();
	});
});
