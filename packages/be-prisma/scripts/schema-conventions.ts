import path from "node:path";

export const BASE_SCHEMA_FILE = "_base.prisma";
export const ENUMS_SCHEMA_FILE = "_enums.prisma";

export const PRISMA_DATA_TYPES = [
	"MASTER",
	"REFERENCE",
	"CONFIGURATION",
	"TRANSACTION",
	"EVENT",
] as const;

export type PrismaDataType = (typeof PRISMA_DATA_TYPES)[number];

const allowedDataTypes = new Set<string>(PRISMA_DATA_TYPES);
const allowedArchitectureTags = new Set([
	"aggregate-root",
	"data-type",
	"description",
]);

export interface SchemaFileInput {
	path: string;
	text: string;
}

export interface SchemaConventionInput {
	directories?: string[];
	files: SchemaFileInput[];
}

export interface SchemaValidationSummary {
	modelTypeCounts: Record<PrismaDataType, number>;
	declarationCount: number;
	enumCount: number;
	fileCount: number;
	modelCount: number;
}

export interface SchemaValidationResult {
	errors: string[];
	summary: SchemaValidationSummary;
}

interface ArchitectureTag {
	hasValue: boolean;
	name: string;
	value: string;
}

interface Declaration {
	file: string;
	kind: "datasource" | "enum" | "generator" | "model" | "type" | "view";
	name: string;
}

interface DocumentedModel {
	documentation: string;
	name: string;
}

/**
 * Prisma model 또는 enum 이름을 schema 파일명에 쓰는 kebab-case로 바꿉니다.
 *
 * @param name Prisma 선언 이름
 * @returns 기계적으로 계산한 kebab-case 이름
 */
export function toKebabCase(name: string): string {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.toLowerCase();
}

/**
 * schema 파일명으로부터 공개 ULID 필드명을 계산합니다.
 *
 * @param kebabName 확장자를 제외한 kebab-case 파일명
 * @returns lowerCamelCase 공개 식별자 필드명
 */
export function toPublicIdentifierFieldName(kebabName: string): string {
	const parts = kebabName.split("-").filter((part) => part.length > 0);

	return `${parts
		.map((part, index) =>
			index === 0 ? part : `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`,
		)
		.join("")}Id`;
}

/**
 * lowerCamelCase 필드명을 snake_case DB 컬럼명으로 바꿉니다.
 *
 * @param fieldName Prisma 필드명
 * @returns snake_case DB 컬럼명
 */
export function toSnakeCaseFieldName(fieldName: string): string {
	return fieldName.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

/**
 * schema 루트 기준 상대 경로를 `/` 구분자로 정규화합니다.
 *
 * @param relativePath schema 루트 기준 상대 경로
 * @returns POSIX 스타일 상대 경로
 */
export function normalizeSchemaRelativePath(relativePath: string): string {
	const slashNormalized = relativePath.replace(/\\/g, "/");
	const normalized = path.posix.normalize(slashNormalized);

	if (normalized === ".") {
		return "";
	}

	return normalized.replace(/^\.\//, "");
}

/**
 * 검증 성공 메시지에 사용할 요약 문자열을 만듭니다.
 *
 * @param summary schema 검증 요약
 * @returns schema:check 성공 메시지
 */
export function formatSchemaCheckSuccess(
	summary: SchemaValidationSummary,
): string {
	const modelTypeSummary = PRISMA_DATA_TYPES.map(
		(modelType) => `${modelType}=${summary.modelTypeCounts[modelType]}`,
	).join(", ");

	return `[schema:check] OK (${summary.fileCount} files / ${summary.modelCount} models / ${summary.enumCount} enums / ${summary.declarationCount} declarations; data-types: ${modelTypeSummary})`;
}

/**
 * 단일 폴더 Prisma schema 계약을 검증합니다.
 *
 * @param input schema 파일 내용과 디렉터리 목록
 * @returns 오류 목록과 통계 요약
 */
export function validateSchemaConventions(
	input: SchemaConventionInput,
): SchemaValidationResult {
	const files = normalizeFiles(input.files);
	const directories = normalizeDirectories(input.directories ?? []);
	const errors: string[] = [];
	const declarationsByName = new Map<string, Declaration[]>();
	const textsByFile = new Map<string, string>();
	const modelTypeCounts = createEmptyModelTypeCounts();
	let modelCount = 0;
	let enumCount = 0;

	validateNoSchemaSubdirectories(directories, errors);
	validateFilePathCollisions(files, errors);
	validateRequiredReservedFiles(files, errors);

	for (const file of files) {
		const filePath = file.path;
		const text = file.text;
		const declarations = getDeclarations(text);
		const models = getDocumentedModels(text);
		const architectureTags = getArchitectureTags(text);

		textsByFile.set(filePath, text);
		modelCount += declarations.filter((entry) => entry.kind === "model").length;
		enumCount += declarations.filter((entry) => entry.kind === "enum").length;

		for (const declaration of declarations) {
			const entries = declarationsByName.get(declaration.name) ?? [];
			entries.push({ ...declaration, file: filePath });
			declarationsByName.set(declaration.name, entries);
		}

		validateArchitectureTags(filePath, architectureTags, errors);

		if (filePath.includes("/")) {
			errors.push(
				`[${filePath}] schema files must be placed directly under schema/`,
			);
		}

		if (filePath === BASE_SCHEMA_FILE) {
			validateBaseFile(filePath, declarations, architectureTags, errors);
			continue;
		}

		if (filePath === ENUMS_SCHEMA_FILE) {
			validateEnumsFile(filePath, declarations, architectureTags, errors);
			continue;
		}

		validateModelFile({
			architectureTags,
			modelTypeCounts,
			declarations,
			errors,
			filePath,
			models,
			text,
		});
	}

	validateGlobalGeneratorAndDatasourceCounts(
		Array.from(declarationsByName.values()).flat(),
		errors,
	);
	validateDuplicateDeclarations(declarationsByName, errors);
	validateUnusedEnums(declarationsByName, textsByFile, errors);

	return {
		errors,
		summary: {
			modelTypeCounts,
			declarationCount: modelCount + enumCount,
			enumCount,
			fileCount: files.length,
			modelCount,
		},
	};
}

/**
 * 입력 파일 경로를 정규화하고 안정적인 순서로 정렬합니다.
 *
 * @param files 검사할 schema 파일 목록
 * @returns 정규화된 schema 파일 목록
 */
function normalizeFiles(files: SchemaFileInput[]): SchemaFileInput[] {
	return files
		.map((file) => ({
			...file,
			path: normalizeSchemaRelativePath(file.path),
		}))
		.sort((left, right) => compareAscii(left.path, right.path));
}

/**
 * 입력 디렉터리 경로를 정규화하고 중복을 제거합니다.
 *
 * @param directories schema 루트 아래 디렉터리 경로
 * @returns 정규화된 디렉터리 경로 목록
 */
function normalizeDirectories(directories: string[]): string[] {
	return Array.from(
		new Set(
			directories
				.map((directory) => normalizeSchemaRelativePath(directory))
				.filter((directory) => directory.length > 0),
		),
	).sort(compareAscii);
}

/**
 * ASCII 기준의 결정적 정렬 순서를 제공합니다.
 *
 * @param left 왼쪽 값
 * @param right 오른쪽 값
 * @returns 정렬 비교 결과
 */
function compareAscii(left: string, right: string): number {
	if (left < right) {
		return -1;
	}
	if (left > right) {
		return 1;
	}
	return 0;
}

/**
 * 데이터 타입별 모델 수 집계 객체를 초기화합니다.
 *
 * @returns 모든 데이터 타입이 0인 집계 객체
 */
function createEmptyModelTypeCounts(): Record<PrismaDataType, number> {
	return {
		CONFIGURATION: 0,
		EVENT: 0,
		MASTER: 0,
		REFERENCE: 0,
		TRANSACTION: 0,
	};
}

/**
 * schema 루트 아래 디렉터리가 남아 있는지 검사합니다.
 *
 * @param directories schema 루트 아래 디렉터리 목록
 * @param errors 오류 누적 목록
 */
function validateNoSchemaSubdirectories(
	directories: string[],
	errors: string[],
): void {
	for (const directory of directories) {
		errors.push(
			`[${directory}] schema directory must not contain subdirectories`,
		);
	}
}

/**
 * 파일 경로의 정규화/대소문자 무시 충돌을 검사합니다.
 *
 * @param files 검사할 schema 파일 목록
 * @param errors 오류 누적 목록
 */
function validateFilePathCollisions(
	files: SchemaFileInput[],
	errors: string[],
): void {
	const filesByCollisionKey = new Map<string, string[]>();

	for (const file of files) {
		const key = getCollisionKey(file.path);
		const entries = filesByCollisionKey.get(key) ?? [];
		entries.push(file.path);
		filesByCollisionKey.set(key, entries);
	}

	for (const entries of filesByCollisionKey.values()) {
		const uniqueEntries = Array.from(new Set(entries)).sort(compareAscii);
		if (uniqueEntries.length > 1) {
			errors.push(
				`schema file path collision after normalization: ${uniqueEntries.join(", ")}`,
			);
		}
	}
}

/**
 * 경로 충돌 검사에 사용할 정규화 키를 만듭니다.
 *
 * @param filePath schema 상대 경로
 * @returns Unicode와 대소문자를 정규화한 키
 */
function getCollisionKey(filePath: string): string {
	return normalizeSchemaRelativePath(filePath)
		.normalize("NFC")
		.toLocaleLowerCase("en-US");
}

/**
 * 단일 폴더 schema에서 필요한 예약 파일이 정확히 존재하는지 검사합니다.
 *
 * @param files 검사할 schema 파일 목록
 * @param errors 오류 누적 목록
 */
function validateRequiredReservedFiles(
	files: SchemaFileInput[],
	errors: string[],
): void {
	const filePaths = new Set(files.map((file) => file.path));

	for (const requiredFile of [BASE_SCHEMA_FILE, ENUMS_SCHEMA_FILE]) {
		if (!filePaths.has(requiredFile)) {
			errors.push(`missing required schema file: ${requiredFile}`);
		}
	}

	for (const filePath of filePaths) {
		const baseName = filePath.split("/").at(-1) ?? filePath;
		if (
			baseName.startsWith("_") &&
			baseName !== BASE_SCHEMA_FILE &&
			baseName !== ENUMS_SCHEMA_FILE
		) {
			errors.push(`[${filePath}] unknown reserved schema file`);
		}
	}
}

/**
 * Prisma 파일에서 주요 top-level block 선언을 추출합니다.
 *
 * @param text Prisma 파일 내용
 * @returns top-level 선언 목록
 */
function getDeclarations(text: string): Declaration[] {
	const pattern =
		/^\s*(generator|datasource|model|enum|view|type)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm;
	const declarations: Declaration[] = [];

	let match = pattern.exec(text);
	while (match) {
		declarations.push({
			file: "",
			kind: match[1] as Declaration["kind"],
			name: match[2],
		});
		match = pattern.exec(text);
	}

	return declarations;
}

/**
 * 각 model과 바로 위에 붙은 주석 블록을 함께 추출합니다.
 *
 * @param text Prisma 파일 내용
 * @returns 모델 이름과 인접 문서 주석 목록
 */
function getDocumentedModels(text: string): DocumentedModel[] {
	const pattern =
		/((?:^[ \t]*\/\/[^\n]*\n)+)?^[ \t]*model\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm;
	const models: DocumentedModel[] = [];

	let match = pattern.exec(text);
	while (match) {
		models.push({
			documentation: match[1] ?? "",
			name: match[2],
		});
		match = pattern.exec(text);
	}

	return models;
}

/**
 * `// @tag: value` 계열의 schema 설계 메타데이터를 추출합니다.
 *
 * @param text 검사할 파일 또는 모델 주석
 * @returns 설계 메타데이터 목록
 */
function getArchitectureTags(text: string): ArchitectureTag[] {
	const pattern =
		/^[ \t]*\/\/(?!\/)\s*@([A-Za-z][A-Za-z0-9-]*)(?::\s*(.*?))?\s*$/gm;
	const tags: ArchitectureTag[] = [];

	let match = pattern.exec(text);
	while (match) {
		tags.push({
			hasValue: match[2] !== undefined,
			name: match[1],
			value: match[2]?.trim() ?? "",
		});
		match = pattern.exec(text);
	}

	return tags;
}

/**
 * 모든 architecture tag의 이름과 값 형식을 검사합니다.
 *
 * @param filePath 검사 중인 schema 상대 경로
 * @param tags 검사할 태그 목록
 * @param errors 오류 누적 목록
 */
function validateArchitectureTags(
	filePath: string,
	tags: ArchitectureTag[],
	errors: string[],
): void {
	for (const tag of tags) {
		if (!allowedArchitectureTags.has(tag.name)) {
			errors.push(`[${filePath}] unsupported architecture tag: @${tag.name}`);
			continue;
		}

		if (!tag.hasValue) {
			errors.push(`[${filePath}] @${tag.name} must use // @${tag.name}: value`);
			continue;
		}

		if (tag.name === "aggregate-root" && tag.value !== "true") {
			errors.push(`[${filePath}] @aggregate-root only supports the value true`);
		}
		if (tag.name === "data-type" && !allowedDataTypes.has(tag.value)) {
			errors.push(
				`[${filePath}] @data-type must be one of ${PRISMA_DATA_TYPES.join(", ")}`,
			);
		}
		if (tag.name === "description" && tag.value.length === 0) {
			errors.push(`[${filePath}] @description must not be empty`);
		}
	}
}

/**
 * `_base.prisma` 예약 파일의 선언 계약을 검사합니다.
 *
 * @param filePath 검사 중인 schema 상대 경로
 * @param declarations 파일 안의 top-level 선언 목록
 * @param architectureTags 파일 안의 architecture tag 목록
 * @param errors 오류 누적 목록
 */
function validateBaseFile(
	filePath: string,
	declarations: Declaration[],
	architectureTags: ArchitectureTag[],
	errors: string[],
): void {
	const generatorCount = countDeclarations(declarations, "generator");
	const datasourceCount = countDeclarations(declarations, "datasource");
	const modelCount = countDeclarations(declarations, "model");
	const enumCount = countDeclarations(declarations, "enum");
	const unsupportedDeclarations = declarations.filter(
		(entry) => entry.kind === "type" || entry.kind === "view",
	);

	if (architectureTags.length > 0) {
		errors.push(
			`[${filePath}] reserved schema file must not declare architecture tags`,
		);
	}
	if (modelCount > 0 || enumCount > 0) {
		errors.push(`[${filePath}] base schema must not declare models or enums`);
	}
	if (generatorCount !== 1) {
		errors.push(
			`[${filePath}] must contain exactly 1 generator block, found ${generatorCount}`,
		);
	}
	if (datasourceCount !== 1) {
		errors.push(
			`[${filePath}] must contain exactly 1 datasource block, found ${datasourceCount}`,
		);
	}
	for (const declaration of unsupportedDeclarations) {
		errors.push(
			`[${filePath}] unsupported top-level declaration: ${declaration.kind} ${declaration.name}`,
		);
	}
}

/**
 * `_enums.prisma` 예약 파일의 enum 전용 계약을 검사합니다.
 *
 * @param filePath 검사 중인 schema 상대 경로
 * @param declarations 파일 안의 top-level 선언 목록
 * @param architectureTags 파일 안의 architecture tag 목록
 * @param errors 오류 누적 목록
 */
function validateEnumsFile(
	filePath: string,
	declarations: Declaration[],
	architectureTags: ArchitectureTag[],
	errors: string[],
): void {
	const enumNames = declarations
		.filter((entry) => entry.kind === "enum")
		.map((entry) => entry.name);
	const nonEnumDeclarations = declarations.filter(
		(entry) => entry.kind !== "enum",
	);
	const sortedEnumNames = [...enumNames].sort(compareAscii);

	if (architectureTags.length > 0) {
		errors.push(
			`[${filePath}] reserved schema file must not declare architecture tags`,
		);
	}
	for (const declaration of nonEnumDeclarations) {
		errors.push(
			`[${filePath}] only enum declarations are allowed, found ${declaration.kind} ${declaration.name}`,
		);
	}
	if (enumNames.join("\n") !== sortedEnumNames.join("\n")) {
		errors.push(
			`[${filePath}] enums must be sorted alphabetically: expected ${sortedEnumNames.join(", ")}`,
		);
	}
}

interface ValidateModelFileOptions {
	architectureTags: ArchitectureTag[];
	modelTypeCounts: Record<PrismaDataType, number>;
	declarations: Declaration[];
	errors: string[];
	filePath: string;
	models: DocumentedModel[];
	text: string;
}

/**
 * 일반 모델 파일의 단일 모델/메타데이터/파일명 계약을 검사합니다.
 *
 * @param options 모델 파일 검사에 필요한 값
 */
function validateModelFile(options: ValidateModelFileOptions): void {
	const {
		architectureTags,
		modelTypeCounts,
		declarations,
		errors,
		filePath,
		models,
		text,
	} = options;
	const baseName = filePath.split("/").at(-1) ?? filePath;
	const modelDeclarations = declarations.filter(
		(entry) => entry.kind === "model",
	);
	const enumDeclarations = declarations.filter(
		(entry) => entry.kind === "enum",
	);
	const forbiddenBlockDeclarations = declarations.filter(
		(entry) =>
			entry.kind === "datasource" ||
			entry.kind === "generator" ||
			entry.kind === "type" ||
			entry.kind === "view",
	);
	const attachedArchitectureTagCount = models.reduce(
		(total, model) => total + getArchitectureTags(model.documentation).length,
		0,
	);

	if (architectureTags.length !== attachedArchitectureTagCount) {
		errors.push(
			`[${filePath}] architecture tags must directly precede a model declaration`,
		);
	}
	if (modelDeclarations.length !== 1) {
		errors.push(
			`[${filePath}] model schema file must contain exactly 1 model, found ${modelDeclarations.length}`,
		);
	}
	if (enumDeclarations.length > 0) {
		errors.push(`[${filePath}] model schema file must not declare enums`);
	}
	for (const declaration of forbiddenBlockDeclarations) {
		errors.push(
			`[${filePath}] model schema file must not declare ${declaration.kind} ${declaration.name}`,
		);
	}

	if (modelDeclarations.length !== 1 || models.length !== 1) {
		return;
	}

	const model = models[0];
	const expectedFileName = `${toKebabCase(model.name)}.prisma`;

	if (!isUpperCamelCase(model.name)) {
		errors.push(
			`[${filePath}] model name must be UpperCamelCase: ${model.name}`,
		);
	}
	if (baseName !== expectedFileName) {
		errors.push(
			`[${filePath}] expected file name ${expectedFileName} for model ${model.name}`,
		);
	}

	validateModelMetadata(filePath, model, modelTypeCounts, errors);
	validateModelIdentityContract(filePath, model.name, text, errors);
}

/**
 * 공개 ULID와 내부 BigInt PK/FK 계약을 검사합니다.
 *
 * @param filePath 검사 중인 schema 상대 경로
 * @param modelName Prisma model 이름
 * @param text model schema 전체
 * @param errors 오류 누적 목록
 */
function validateModelIdentityContract(
	filePath: string,
	modelName: string,
	text: string,
	errors: string[],
): void {
	const legacySequenceToken = ["s", "e", "q"].join("");
	const legacyRelationSuffix = `${legacySequenceToken[0]?.toUpperCase()}${legacySequenceToken.slice(1)}`;
	const baseName =
		filePath
			.split("/")
			.at(-1)
			?.replace(/\.prisma$/, "") ?? "";
	const publicIdentifierName = toPublicIdentifierFieldName(baseName);
	const publicIdentifierMap = `${baseName.replace(/-/g, "_")}_id`;
	const idField = text.match(/^[ \t]*id[ \t]+([^\n]+)$/m)?.[1] ?? "";
	const publicIdentifierField =
		text.match(
			new RegExp(`^[ \t]*${publicIdentifierName}[ \t]+([^\\n]+)$`, "m"),
		)?.[1] ?? "";

	if (
		!idField.startsWith("BigInt") ||
		!idField.includes("@id") ||
		!idField.includes("@default(autoincrement())")
	) {
		errors.push(
			`[${filePath}] ${modelName}.id must be BigInt @id @default(autoincrement())`,
		);
	}

	if (new RegExp(`^[ \\t]*${legacySequenceToken}[ \\t]+`, "m").test(text)) {
		errors.push(
			`[${filePath}] ${modelName} legacy sequence primary key is not allowed`,
		);
	}

	if (
		!publicIdentifierField.startsWith("String") ||
		!publicIdentifierField.includes("@unique") ||
		!publicIdentifierField.includes("@default(ulid())") ||
		!publicIdentifierField.includes(`@map("${publicIdentifierMap}")`) ||
		!publicIdentifierField.includes("@db.Char(26)") ||
		publicIdentifierField.includes("@id")
	) {
		errors.push(
			`[${filePath}] ${modelName}.${publicIdentifierName} must be String @unique @default(ulid()) @map("${publicIdentifierMap}") @db.Char(26) and must not be the primary key`,
		);
	}

	const legacySequenceFieldNames = Array.from(
		text.matchAll(
			new RegExp(
				`^[ \\t]*([A-Za-z][A-Za-z0-9_]*${legacyRelationSuffix})[ \\t]+`,
				"gm",
			),
		),
	).map((match) => match[1]);
	if (legacySequenceFieldNames.length > 0) {
		errors.push(
			`[${filePath}] ${modelName} fields must not use the legacy sequence naming contract: ${legacySequenceFieldNames.join(", ")}`,
		);
	}

	const relationPattern =
		/@relation\([^\n]*fields:\s*\[([^\]]+)\][^\n]*references:\s*\[([^\]]+)\][^\n]*\)/g;
	let relation = relationPattern.exec(text);
	while (relation) {
		const fields = relation[1].split(",").map((field) => field.trim());
		const references = relation[2]
			.split(",")
			.map((reference) => reference.trim());

		if (fields.some((field) => !field.endsWith("Id"))) {
			errors.push(
				`[${filePath}] ${modelName} relation fields must use the <relation>Id naming contract: ${fields.join(", ")}`,
			);
		}
		for (const field of fields) {
			const fieldDefinition =
				text.match(new RegExp(`^[ \t]*${field}[ \t]+([^\\n]+)$`, "m"))?.[1] ??
				"";
			const expectedMap = `${toSnakeCaseFieldName(field)}`;

			if (!fieldDefinition.startsWith("BigInt")) {
				errors.push(
					`[${filePath}] ${modelName}.${field} relation scalar must be BigInt`,
				);
			}
			if (!fieldDefinition.includes(`@map("${expectedMap}")`)) {
				errors.push(
					`[${filePath}] ${modelName}.${field} relation scalar must map to "${expectedMap}"`,
				);
			}
		}
		if (references.some((reference) => reference !== "id")) {
			errors.push(
				`[${filePath}] ${modelName} relations must reference the internal id key: ${references.join(", ")}`,
			);
		}

		relation = relationPattern.exec(text);
	}
}
/**
 * 모델의 필수 metadata tag와 displayName 문서를 검사합니다.
 *
 * @param filePath 검사 중인 schema 상대 경로
 * @param model 검사할 모델과 인접 문서 주석
 * @param modelTypeCounts 데이터 타입별 모델 수 집계
 * @param errors 오류 누적 목록
 */
function validateModelMetadata(
	filePath: string,
	model: DocumentedModel,
	modelTypeCounts: Record<PrismaDataType, number>,
	errors: string[],
): void {
	const modelTypes = getTagValues(model.documentation, "data-type");
	const descriptions = getTagValues(model.documentation, "description");
	const aggregateRoots = getTagValues(model.documentation, "aggregate-root");
	const displayNames = getDisplayNames(model.documentation);
	const invalidDisplayNameCount = countMatches(
		model.documentation,
		/@DisplayName|@displayname/g,
	);

	if (modelTypes.length !== 1) {
		errors.push(
			`[${filePath}] ${model.name} must contain exactly 1 @data-type, found ${modelTypes.length}`,
		);
	}
	if (modelTypes.length === 1 && allowedDataTypes.has(modelTypes[0])) {
		modelTypeCounts[modelTypes[0] as PrismaDataType] += 1;
	}
	if (descriptions.length !== 1) {
		errors.push(
			`[${filePath}] ${model.name} must contain exactly 1 @description, found ${descriptions.length}`,
		);
	}
	if (displayNames.length !== 1) {
		errors.push(
			`[${filePath}] ${model.name} must contain exactly 1 /// @displayName, found ${displayNames.length}`,
		);
	}
	if (invalidDisplayNameCount > 0) {
		errors.push(
			`[${filePath}] ${model.name} contains invalid displayName casing (@DisplayName or @displayname)`,
		);
	}
	if (aggregateRoots.length > 1) {
		errors.push(
			`[${filePath}] ${model.name} must contain at most 1 @aggregate-root, found ${aggregateRoots.length}`,
		);
	}
}

/**
 * 모델명 계약에 맞는 UpperCamelCase인지 검사합니다.
 *
 * @param name Prisma model 이름
 * @returns UpperCamelCase이면 true
 */
function isUpperCamelCase(name: string): boolean {
	return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

/**
 * 지정한 declaration kind 개수를 계산합니다.
 *
 * @param declarations top-level 선언 목록
 * @param kind 셀 declaration kind
 * @returns kind가 일치하는 선언 수
 */
function countDeclarations(
	declarations: Declaration[],
	kind: Declaration["kind"],
): number {
	return declarations.filter((entry) => entry.kind === kind).length;
}

/**
 * 모델 주석 안에서 지정한 설계 tag 값을 찾습니다.
 *
 * @param documentation 모델 바로 위의 문서 주석
 * @param tag 찾을 tag 이름
 * @returns tag 값 목록
 */
function getTagValues(documentation: string, tag: string): string[] {
	return getArchitectureTags(documentation)
		.filter((entry) => entry.name === tag)
		.map((entry) => entry.value);
}

/**
 * 모델의 `/// @displayName` 값을 찾습니다.
 *
 * @param documentation 모델 바로 위의 문서 주석
 * @returns displayName 값 목록
 */
function getDisplayNames(documentation: string): string[] {
	const pattern = /^[ \t]*\/\/\/ @displayName\s+(.+?)\s*$/gm;
	const names: string[] = [];

	let match = pattern.exec(documentation);
	while (match) {
		names.push(match[1]);
		match = pattern.exec(documentation);
	}

	return names;
}

/**
 * 정규식 일치 개수를 계산합니다.
 *
 * @param text 검사할 문자열
 * @param pattern global flag가 포함된 정규식
 * @returns 일치 개수
 */
function countMatches(text: string, pattern: RegExp): number {
	return text.match(pattern)?.length ?? 0;
}

/**
 * schema 전체의 generator/datasource 개수가 하나인지 검사합니다.
 *
 * @param declarations schema 전체 top-level 선언 목록
 * @param errors 오류 누적 목록
 */
function validateGlobalGeneratorAndDatasourceCounts(
	declarations: Declaration[],
	errors: string[],
): void {
	const generatorCount = countDeclarations(declarations, "generator");
	const datasourceCount = countDeclarations(declarations, "datasource");

	if (generatorCount !== 1) {
		errors.push(
			`expected exactly 1 generator block globally, found ${generatorCount}`,
		);
	}
	if (datasourceCount !== 1) {
		errors.push(
			`expected exactly 1 datasource block globally, found ${datasourceCount}`,
		);
	}
}

/**
 * schema 전체에서 같은 이름의 model/enum 선언이 중복되는지 검사합니다.
 *
 * @param declarationsByName 이름별 선언 목록
 * @param errors 오류 누적 목록
 */
function validateDuplicateDeclarations(
	declarationsByName: Map<string, Declaration[]>,
	errors: string[],
): void {
	for (const [name, entries] of declarationsByName.entries()) {
		if (entries.length <= 1) {
			continue;
		}

		const declaredFiles = entries
			.map((entry) => `${entry.file} (${entry.kind})`)
			.sort(compareAscii)
			.join(", ");
		errors.push(`${name} is declared multiple times: ${declaredFiles}`);
	}
}

/**
 * `_enums.prisma`에 선언된 enum이 실제 model 필드에서 사용되는지 검사합니다.
 *
 * @param declarationsByName 이름별 선언 목록
 * @param textsByFile 파일별 schema 내용
 * @param errors 오류 누적 목록
 */
function validateUnusedEnums(
	declarationsByName: Map<string, Declaration[]>,
	textsByFile: Map<string, string>,
	errors: string[],
): void {
	const mergedText = Array.from(textsByFile.values()).join("\n");

	for (const [name, entries] of declarationsByName.entries()) {
		if (!entries.some((entry) => entry.kind === "enum")) {
			continue;
		}

		const usageCount = countMatches(
			mergedText,
			new RegExp(`\\b${name}\\b`, "g"),
		);
		if (usageCount <= entries.length) {
			errors.push(`enum ${name} is unused`);
		}
	}
}
