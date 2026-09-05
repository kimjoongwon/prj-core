import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { InquiriesController } from "@cocrepo/controller";
import { DECIMAL_ID_PATTERN_SOURCE } from "@cocrepo/type/database-id";
import type { INestApplication } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
	DocumentBuilder,
	type OpenAPIObject,
	SwaggerModule,
} from "@nestjs/swagger";
import type { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { Test } from "@nestjs/testing";
import ts from "typescript";
import { applyBigIntIdOpenApiContract } from "./bigint-id.openapi";

const participantPublicFields = [
	"id",
	"createdAt",
	"updatedAt",
	"removedAt",
	"inquiryId",
	"threadId",
	"userId",
	"role",
	"isOnline",
	"isTyping",
	"unreadCount",
	"joinedAt",
	"lastSeenAt",
	"lastReadAt",
	"leftAt",
].sort();

describe("문의 참여자 OpenAPI와 생성 SDK 계약", () => {
	let app: INestApplication;
	let document: OpenAPIObject;
	let participantSchema: SchemaObject;

	beforeAll(async () => {
		const testingModule = await Test.createTestingModule({
			controllers: [InquiriesController],
			providers: [CommandBus, QueryBus, AuthContext, SpaceContext].map(
				(provider) => ({ provide: provider, useValue: {} }),
			),
		}).compile();
		app = testingModule.createNestApplication();
		app.setGlobalPrefix("api/v1/inquiries");
		document = SwaggerModule.createDocument(
			app,
			new DocumentBuilder().setTitle("문의 API 계약").setVersion("1").build(),
		);
		applyBigIntIdOpenApiContract(document);
		participantSchema = document.components?.schemas
			?.InquiryParticipant as SchemaObject;
	});

	afterAll(async () => {
		await app?.close();
	});

	it("실제 Controller 응답이 기존 InquiryParticipant 스키마명을 참조한다", () => {
		const operation =
			document.paths["/api/v1/inquiries/{inquiryId}/participants"]?.get;

		expect(operation).toMatchObject({
			operationId: "getInquiryParticipants",
		});
		expect(JSON.stringify(operation?.responses["200"])).toContain(
			'"$ref":"#/components/schemas/InquiryParticipant"',
		);
	});

	it("문서화된 15개 필드와 선택·null 계약을 유지하고 내부 속성을 노출하지 않는다", () => {
		expect(participantSchema.type).toBe("object");
		expect(Object.keys(participantSchema.properties ?? {}).sort()).toEqual(
			participantPublicFields,
		);
		expect([...(participantSchema.required ?? [])].sort()).toEqual(
			participantPublicFields.filter((fieldName) => fieldName !== "threadId"),
		);
		for (const fieldName of [
			"threadId",
			"updatedAt",
			"removedAt",
			"lastSeenAt",
			"lastReadAt",
			"leftAt",
		]) {
			expect(participantSchema.properties?.[fieldName]).toMatchObject({
				nullable: true,
			});
		}
		for (const privateField of [
			"inquiryParticipantId",
			"inquiry",
			"thread",
			"user",
			"password",
		]) {
			expect(participantSchema.properties).not.toHaveProperty(privateField);
		}
	});

	it("ID를 canonical decimal 문자열로, 시각을 date-time으로 문서화한다", () => {
		for (const idField of ["id", "inquiryId", "threadId", "userId"]) {
			expect(participantSchema.properties?.[idField]).toMatchObject({
				type: "string",
				pattern: DECIMAL_ID_PATTERN_SOURCE,
				"x-runtime-type": "bigint",
			});
		}
		for (const dateField of [
			"createdAt",
			"updatedAt",
			"removedAt",
			"joinedAt",
			"lastSeenAt",
			"lastReadAt",
			"leftAt",
		]) {
			expect(participantSchema.properties?.[dateField]).toMatchObject({
				type: "string",
				format: "date-time",
			});
		}
	});

	it("생성 SDK가 같은 15개 필드를 선언하고 임의 키를 허용하지 않는다", () => {
		const sdkPath = resolve(
			__dirname,
			"../../../../../packages/fe-api/src/core/model/inquiryParticipant.ts",
		);
		const sdkSource = ts.createSourceFile(
			sdkPath,
			readFileSync(sdkPath, "utf8"),
			ts.ScriptTarget.Latest,
			true,
		);
		const participantInterface = sdkSource.statements.find(
			(statement) =>
				ts.isInterfaceDeclaration(statement) &&
				statement.name.text === "InquiryParticipant",
		);
		if (
			!participantInterface ||
			!ts.isInterfaceDeclaration(participantInterface)
		) {
			throw new Error("InquiryParticipant SDK interface가 없습니다");
		}
		const sdkProperties = participantInterface.members.filter(
			ts.isPropertySignature,
		);

		expect(
			sdkProperties.map((property) => property.name.getText(sdkSource)).sort(),
		).toEqual(participantPublicFields);
		expect(
			participantInterface.members.some(ts.isIndexSignatureDeclaration),
		).toBe(false);
		expect(
			sdkProperties
				.filter((property) => property.questionToken)
				.map((property) => property.name.getText(sdkSource)),
		).toEqual(["threadId"]);
	});
});
