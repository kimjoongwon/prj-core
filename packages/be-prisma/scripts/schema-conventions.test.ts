import { describe, expect, it } from "vitest";
import {
	formatSchemaCheckSuccess,
	type SchemaFileInput,
	toKebabCase,
	toPublicIdentifierFieldName,
	validateSchemaConventions,
} from "./schema-conventions";

const baseSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

const enumsSchema = `
enum LanguageCode {
  KO
  EN
}

enum UserStatus {
  ACTIVE
  INACTIVE
}
`;

const userModel = `
// @data-type: MASTER
// @model-role: OBJECT
// @aggregate-owner: User
// @description: 사용자 계정의 현재 상태와 생명주기를 관리
/// @displayName 사용자
model User {
  userId   String       @unique @default(ulid()) @map("user_id") @db.Char(26)
  id       BigInt       @id @default(autoincrement())
  status   UserStatus
  language LanguageCode
}
`;

const authAuditLogModel = `
// @data-type: EVENT
// @model-role: HISTORY
// @aggregate-owner: NONE
// @description: 로그인 시도와 결과를 기록
/// @displayName 인증 감사 로그
model AuthAuditLog {
  authAuditLogId String @unique @default(ulid()) @map("auth_audit_log_id") @db.Char(26)
  id             BigInt @id @default(autoincrement())
}
`;

/**
 * 정상 단일 폴더 schema fixture를 생성합니다.
 *
 * @param overrides 파일별 schema 내용 override
 * @returns schema 검증 입력 파일 목록
 */
function createValidFiles(
	overrides: Record<string, string> = {},
): SchemaFileInput[] {
	return [
		{ path: "_base.prisma", text: baseSchema },
		{ path: "_enums.prisma", text: enumsSchema },
		{ path: "auth-audit-log.prisma", text: authAuditLogModel },
		{ path: "user.prisma", text: userModel },
	].map((file) => ({
		...file,
		text: overrides[file.path] ?? file.text,
	}));
}

/**
 * Aggregate owner 그래프 검증에 사용할 최소 유효 모델을 만듭니다.
 *
 * @param modelName Prisma 모델 이름
 * @param modelRole 모델 역할
 * @param aggregateOwner Aggregate owner 모델 이름 또는 NONE
 * @returns 모델 파일 입력
 */
function createModelFile(
	modelName: string,
	modelRole:
		| "OBJECT"
		| "DETAIL"
		| "ASSOCIATION"
		| "SNAPSHOT"
		| "HISTORY"
		| "TECHNICAL_STATE",
	aggregateOwner: string,
): SchemaFileInput {
	const kebabName = toKebabCase(modelName);
	const publicIdentifierName = toPublicIdentifierFieldName(kebabName);
	const publicIdentifierMap = `${kebabName.replace(/-/g, "_")}_id`;

	return {
		path: `${kebabName}.prisma`,
		text: `
// @data-type: MASTER
// @model-role: ${modelRole}
// @aggregate-owner: ${aggregateOwner}
// @description: Aggregate owner 검증 fixture
/// @displayName ${modelName}
model ${modelName} {
  ${publicIdentifierName} String @unique @default(ulid()) @map("${publicIdentifierMap}") @db.Char(26)
  id BigInt @id @default(autoincrement())
}
`,
	};
}

/**
 * 검증 오류가 기대한 일부 문자열을 포함하는지 확인합니다.
 *
 * @param errors 실제 오류 목록
 * @param fragments 기대 오류 일부 문자열
 */
function expectErrors(errors: string[], fragments: string[]): void {
	for (const fragment of fragments) {
		expect(errors.some((error) => error.includes(fragment))).toBe(true);
	}
}

describe("schema conventions", () => {
	it("Given Prisma 선언 이름 When 파일명을 계산하면 Then 승인된 kebab-case 계약을 따른다", () => {
		expect(toKebabCase("User")).toBe("user");
		expect(toKebabCase("OidcClient")).toBe("oidc-client");
		expect(toKebabCase("AuthAuditLog")).toBe("auth-audit-log");
		expect(toKebabCase("OAuth2Client")).toBe("o-auth2-client");
	});

	it("Given schema 파일명 When 공개 식별자 필드명을 계산하면 Then lowerCamel Id 계약을 따른다", () => {
		expect(toPublicIdentifierFieldName("user")).toBe("userId");
		expect(toPublicIdentifierFieldName("oidc-client")).toBe("oidcClientId");
		expect(toPublicIdentifierFieldName("auth-audit-log")).toBe(
			"authAuditLogId",
		);
	});

	it("Given 단일 폴더 schema When 검증하면 Then count와 data-type 요약을 반환한다", () => {
		const result = validateSchemaConventions({ files: createValidFiles() });

		expect(result.errors).toEqual([]);
		expect(result.summary).toEqual({
			aggregateOwnershipCounts: {
				child: 0,
				external: 1,
				root: 1,
			},
			modelRoleCounts: {
				ASSOCIATION: 0,
				DETAIL: 0,
				HISTORY: 1,
				OBJECT: 1,
				SNAPSHOT: 0,
				TECHNICAL_STATE: 0,
			},
			modelTypeCounts: {
				CONFIGURATION: 0,
				EVENT: 1,
				MASTER: 1,
				REFERENCE: 0,
				TRANSACTION: 0,
			},
			declarationCount: 4,
			enumCount: 2,
			fileCount: 4,
			modelCount: 2,
		});
		expect(formatSchemaCheckSuccess(result.summary)).toContain(
			"4 files / 2 models / 2 enums / 4 declarations",
		);
		expect(formatSchemaCheckSuccess(result.summary)).toContain(
			"MASTER=1, REFERENCE=0, CONFIGURATION=0, TRANSACTION=0, EVENT=1",
		);
		expect(formatSchemaCheckSuccess(result.summary)).toContain(
			"OBJECT=1, DETAIL=0, ASSOCIATION=0, SNAPSHOT=0, HISTORY=1, TECHNICAL_STATE=0",
		);
		expect(formatSchemaCheckSuccess(result.summary)).toContain(
			"ROOT=1, CHILD=0, EXTERNAL=1",
		);
	});

	it("Given schema 하위 폴더가 있으면 When 검증하면 Then 폴더와 nested 파일을 거부한다", () => {
		const result = validateSchemaConventions({
			directories: ["identity"],
			files: [
				{ path: "_base.prisma", text: baseSchema },
				{ path: "_enums.prisma", text: enumsSchema },
				{ path: "identity/user.prisma", text: userModel },
			],
		});

		expectErrors(result.errors, [
			"[identity] schema directory must not contain subdirectories",
			"[identity/user.prisma] schema files must be placed directly under schema/",
		]);
	});

	it("Given 예약 파일이 없거나 추가 underscore 파일이 있으면 When 검증하면 Then 정확한 예약 파일 계약을 강제한다", () => {
		const result = validateSchemaConventions({
			files: [
				{ path: "_base.prisma", text: baseSchema },
				{ path: "_legacy.prisma", text: "" },
				{ path: "user.prisma", text: userModel },
			],
		});

		expectErrors(result.errors, [
			"missing required schema file: _enums.prisma",
			"[_legacy.prisma] unknown reserved schema file",
		]);
	});

	it("Given _base.prisma가 generator/datasource 외 선언을 가지면 When 검증하면 Then 예약 파일 규칙 위반으로 처리한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"_base.prisma": `
// @description: 금지된 태그
generator client {
  provider = "prisma-client-js"
}

model BadBase {
  id BigInt @id
}
`,
			}),
		});

		expectErrors(result.errors, [
			"[_base.prisma] reserved schema file must not declare architecture tags",
			"[_base.prisma] base schema must not declare models or enums",
			"[_base.prisma] must contain exactly 1 datasource block, found 0",
			"expected exactly 1 datasource block globally, found 0",
		]);
	});

	it("Given _enums.prisma가 enum 외 선언이나 정렬 위반을 가지면 When 검증하면 Then enum 전용 파일로 제한한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"_enums.prisma": `
// @model-role: OBJECT
enum UserStatus {
  ACTIVE
}

generator client {
  provider = "prisma-client-js"
}

enum LanguageCode {
  KO
}
`,
			}),
		});

		expectErrors(result.errors, [
			"[_enums.prisma] reserved schema file must not declare architecture tags",
			"[_enums.prisma] only enum declarations are allowed, found generator client",
			"[_enums.prisma] enums must be sorted alphabetically: expected LanguageCode, UserStatus",
			"expected exactly 1 generator block globally, found 2",
		]);
	});

	it("Given 모델 파일에 여러 선언이 섞이면 When 검증하면 Then 한 파일 한 모델 계약을 강제한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": `
// @data-type: MASTER
// @description: 사용자
/// @displayName 사용자
model User {
  id BigInt @id
}

enum LocalEnum {
  A
}

model Profile {
  id BigInt @id
}
`,
			}),
		});

		expectErrors(result.errors, [
			"[user.prisma] model schema file must contain exactly 1 model, found 2",
			"[user.prisma] model schema file must not declare enums",
		]);
	});

	it("Given 일반 모델 파일에 model 선언이 없으면 When 검증하면 Then 모델 0개를 거부한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": "// model 선언이 없는 일반 주석 파일\n",
			}),
		});

		expectErrors(result.errors, [
			"[user.prisma] model schema file must contain exactly 1 model, found 0",
		]);
	});

	it("Given 모델명과 파일명이 계약과 다르면 When 검증하면 Then UpperCamelCase와 계산 파일명을 검사한다", () => {
		const result = validateSchemaConventions({
			files: [
				{ path: "_base.prisma", text: baseSchema },
				{ path: "_enums.prisma", text: "" },
				{
					path: "wrong-name.prisma",
					text: `
// @data-type: MASTER
// @model-role: OBJECT
// @aggregate-owner: NONE
// @description: 잘못된 모델명
/// @displayName 사용자
model user_profile {
  userProfileId String @unique @default(ulid()) @map("user_profile_id") @db.Char(26)
  id            BigInt @id @default(autoincrement())
}
`,
				},
			],
		});

		expectErrors(result.errors, [
			"[wrong-name.prisma] model name must be UpperCamelCase: user_profile",
			"[wrong-name.prisma] expected file name user_profile.prisma for model user_profile",
		]);
	});

	it("Given 모델 metadata가 누락되거나 중복되면 When 검증하면 Then 필수 tag 개수를 검사한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": `
// @data-type: MASTER
// @data-type: EVENT
// @model-role: OBJECT
// @model-role: DETAIL
// @aggregate-owner: User
// @aggregate-owner: NONE
/// @displayName 사용자
/// @DisplayName 잘못된 표시명
model User {
  userId   String       @unique @default(ulid()) @map("user_id") @db.Char(26)
  id       BigInt       @id @default(autoincrement())
  status   UserStatus
  language LanguageCode
}
`,
			}),
		});

		expectErrors(result.errors, [
			"[user.prisma] User must contain exactly 1 @data-type, found 2",
			"[user.prisma] User must contain exactly 1 @description, found 0",
			"[user.prisma] User contains invalid displayName casing",
			"[user.prisma] User must contain exactly 1 @model-role, found 2",
			"[user.prisma] User must contain exactly 1 @aggregate-owner, found 2",
		]);
	});

	it("Given 공개 UUID PK 또는 legacy sequence relation이 있으면 When 검증하면 Then BigInt id와 공개 ULID 계약을 강제한다", () => {
		const legacySequenceToken = ["s", "e", "q"].join("");
		const legacyRelationSuffix = `${legacySequenceToken[0]?.toUpperCase()}${legacySequenceToken.slice(1)}`;
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": `
// @data-type: MASTER
// @model-role: OBJECT
// @aggregate-owner: User
// @description: 잘못된 식별자 계약
/// @displayName 사용자
model User {
  id       String       @id @default(uuid())
  status   UserStatus
  language LanguageCode
  profile  Profile?     @relation(fields: [profile${legacyRelationSuffix}], references: [${legacySequenceToken}])
  profile${legacyRelationSuffix} Int?
}
`,
			}),
		});

		expectErrors(result.errors, [
			"User.id must be BigInt @id @default(autoincrement())",
			'User.userId must be String @unique @default(ulid()) @map("user_id") @db.Char(26)',
			"fields must not use the legacy sequence naming contract",
			"relation fields must use the <relation>Id naming contract",
			"relations must reference the internal id key",
		]);
	});

	it("Given 잘못된 metadata 값이 있으면 When 검증하면 Then metadata 계약을 거부한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": `
// @data-type: master
// @model-role: object
// @aggregate-owner: user
// @aggregate-root: false
// @description: 사용자
/// @displayName 사용자
model User {
  userId   String       @unique @default(ulid()) @map("user_id") @db.Char(26)
  id       BigInt       @id @default(autoincrement())
  status   UserStatus
  language LanguageCode
}
`,
			}),
		});

		expectErrors(result.errors, [
			"[user.prisma] @data-type must be one of MASTER, REFERENCE, CONFIGURATION, TRANSACTION, EVENT",
			"[user.prisma] @model-role must be one of OBJECT, DETAIL, ASSOCIATION, SNAPSHOT, HISTORY, TECHNICAL_STATE",
			"[user.prisma] @aggregate-owner must be NONE or an UpperCamelCase model name",
			"[user.prisma] legacy architecture tag @aggregate-root is not allowed; use @aggregate-owner",
		]);
	});

	it("Given 모델 역할과 Root 여부 조합이 다르면 When 검증하면 Then 두 분류를 독립적으로 허용한다", () => {
		const result = validateSchemaConventions({
			files: [
				...createValidFiles(),
				createModelFile("DetailRoot", "DETAIL", "DetailRoot"),
				createModelFile("ObjectChild", "OBJECT", "User"),
			],
		});

		expect(result.errors).toEqual([]);
	});

	it("Given Aggregate 하위 모델이 존재하지 않는 owner를 가리키면 When 검증하면 Then 누락 owner를 거부한다", () => {
		const result = validateSchemaConventions({
			files: [
				...createValidFiles(),
				createModelFile("Profile", "DETAIL", "MissingRoot"),
			],
		});

		expectErrors(result.errors, [
			"Profile @aggregate-owner references missing model MissingRoot",
		]);
	});

	it("Given Aggregate 하위 모델이 다른 하위 모델을 owner로 삼으면 When 검증하면 Then 직속 Root만 허용한다", () => {
		const result = validateSchemaConventions({
			files: [
				...createValidFiles(),
				createModelFile("Profile", "DETAIL", "User"),
				createModelFile("Post", "DETAIL", "Profile"),
			],
		});

		expectErrors(result.errors, [
			"Post @aggregate-owner must reference a self-owned aggregate root; Profile is owned by User",
		]);
	});

	it("Given Aggregate owner 경로가 순환하면 When 검증하면 Then 순환 경로를 거부한다", () => {
		const result = validateSchemaConventions({
			files: [
				...createValidFiles(),
				createModelFile("Profile", "DETAIL", "Post"),
				createModelFile("Post", "DETAIL", "Profile"),
			],
		});

		expectErrors(result.errors, [
			"aggregate ownership cycle is not allowed: Post -> Profile -> Post",
			"aggregate ownership cycle is not allowed: Profile -> Post -> Profile",
		]);
	});

	it("Given architecture tag가 모델 바로 위에 없으면 When 검증하면 Then unattached tag를 거부한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": `
// @data-type: MASTER
// @model-role: OBJECT
// @aggregate-owner: User
// @description: 사용자
/// @displayName 사용자

model User {
  userId   String       @unique @default(ulid()) @map("user_id") @db.Char(26)
  id       BigInt       @id @default(autoincrement())
  status   UserStatus
  language LanguageCode
}
`,
			}),
		});

		expectErrors(result.errors, [
			"[user.prisma] architecture tags must directly precede a model declaration",
			"[user.prisma] User must contain exactly 1 @data-type, found 0",
			"[user.prisma] User must contain exactly 1 @model-role, found 0",
			"[user.prisma] User must contain exactly 1 @aggregate-owner, found 0",
			"[user.prisma] User must contain exactly 1 @description, found 0",
		]);
	});

	it("Given enum이 중복되거나 사용되지 않으면 When 검증하면 Then duplicate와 unused enum을 유지 검사한다", () => {
		const duplicateResult = validateSchemaConventions({
			files: createValidFiles({
				"_enums.prisma": `
enum LanguageCode {
  KO
}

enum LanguageCode {
  EN
}

enum UserStatus {
  ACTIVE
}
`,
			}),
		});
		const unusedResult = validateSchemaConventions({
			files: createValidFiles({
				"_enums.prisma": `
enum LanguageCode {
  KO
}

enum UnusedStatus {
  ACTIVE
}

enum UserStatus {
  ACTIVE
}
`,
			}),
		});

		expectErrors(duplicateResult.errors, [
			"LanguageCode is declared multiple times: _enums.prisma (enum), _enums.prisma (enum)",
		]);
		expectErrors(unusedResult.errors, ["enum UnusedStatus is unused"]);
	});

	it("Given 대소문자만 다른 파일이 있으면 When 검증하면 Then normalized filename collision을 감지한다", () => {
		const result = validateSchemaConventions({
			files: [
				...createValidFiles(),
				{
					path: "User.prisma",
					text: `
// @data-type: MASTER
// @model-role: OBJECT
// @aggregate-owner: NONE
// @description: 중복 사용자
/// @displayName 사용자 중복
model UserCopy {
  userCopyId String @unique @default(ulid()) @map("user_copy_id") @db.Char(26)
  id         BigInt @id @default(autoincrement())
}
`,
				},
			],
		});

		expectErrors(result.errors, [
			"schema file path collision after normalization: User.prisma, user.prisma",
			"[User.prisma] expected file name user-copy.prisma for model UserCopy",
		]);
	});
});
