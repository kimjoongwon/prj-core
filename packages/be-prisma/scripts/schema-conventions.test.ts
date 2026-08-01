import { describe, expect, it } from "vitest";
import {
	formatSchemaCheckSuccess,
	type SchemaFileInput,
	toKebabCase,
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
// @aggregate-root: true
// @description: 사용자 계정의 현재 상태와 생명주기를 관리
/// @displayName 사용자
model User {
  id       String       @unique @default(ulid()) @db.VarChar(26)
  seq      Int          @id @default(autoincrement())
  status   UserStatus
  language LanguageCode
}
`;

const aiAgentLogModel = `
// @data-type: EVENT
// @description: AI 에이전트 작업 이력을 기록
/// @displayName AI 에이전트 로그
model AIAgentLog {
  id  String @unique @default(ulid()) @db.VarChar(26)
  seq Int    @id @default(autoincrement())
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
		{ path: "ai-agent-log.prisma", text: aiAgentLogModel },
		{ path: "user.prisma", text: userModel },
	].map((file) => ({
		...file,
		text: overrides[file.path] ?? file.text,
	}));
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
		expect(toKebabCase("AIAgentLog")).toBe("ai-agent-log");
		expect(toKebabCase("OAuth2Client")).toBe("o-auth2-client");
	});

	it("Given 단일 폴더 schema When 검증하면 Then count와 data-type 요약을 반환한다", () => {
		const result = validateSchemaConventions({ files: createValidFiles() });

		expect(result.errors).toEqual([]);
		expect(result.summary).toEqual({
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
  id String @id
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
  id String @id
}

enum LocalEnum {
  A
}

model Profile {
  id String @id
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
// @description: 잘못된 모델명
/// @displayName 사용자
model user_profile {
  id String @id
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
// @aggregate-root: true
// @aggregate-root: true
/// @displayName 사용자
/// @DisplayName 잘못된 표시명
model User {
  id       String       @id
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
			"[user.prisma] User must contain at most 1 @aggregate-root, found 2",
		]);
	});

	it("Given 공개 UUID PK 또는 id 기반 relation이 있으면 When 검증하면 Then ULID id와 seq 내부키 계약을 강제한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": `
// @data-type: MASTER
// @description: 잘못된 식별자 계약
/// @displayName 사용자
model User {
  id       String       @id @default(uuid())
  status   UserStatus
  language LanguageCode
  profile  Profile?     @relation(fields: [profileId], references: [id])
  profileId String?
}
`,
			}),
		});

		expectErrors(result.errors, [
			"User.id must be String @unique @default(ulid()) @db.VarChar(26)",
			"User.seq must be Int @id @default(autoincrement())",
			"relation fields must use the <relation>Seq naming contract",
			"relations must reference the internal seq key",
		]);
	});

	it("Given 잘못된 metadata 값이 있으면 When 검증하면 Then metadata 계약을 거부한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": `
// @data-type: master
// @aggregate-root: false
// @description: 사용자
/// @displayName 사용자
model User {
  id       String       @id
  status   UserStatus
  language LanguageCode
}
`,
			}),
		});

		expectErrors(result.errors, [
			"[user.prisma] @data-type must be one of MASTER, REFERENCE, CONFIGURATION, TRANSACTION, EVENT",
			"[user.prisma] @aggregate-root only supports the value true",
		]);
	});

	it("Given architecture tag가 모델 바로 위에 없으면 When 검증하면 Then unattached tag를 거부한다", () => {
		const result = validateSchemaConventions({
			files: createValidFiles({
				"user.prisma": `
// @data-type: MASTER
// @description: 사용자
/// @displayName 사용자

model User {
  id       String       @id
  status   UserStatus
  language LanguageCode
}
`,
			}),
		});

		expectErrors(result.errors, [
			"[user.prisma] architecture tags must directly precede a model declaration",
			"[user.prisma] User must contain exactly 1 @data-type, found 0",
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
// @description: 중복 사용자
/// @displayName 사용자 중복
model UserCopy {
  id String @id
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
