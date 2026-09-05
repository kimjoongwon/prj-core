import { DECIMAL_ID_PATTERN_SOURCE } from "@cocrepo/type/database-id";
import type { OpenAPIObject } from "@nestjs/swagger";
import type { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { applyBigIntIdOpenApiContract } from "./bigint-id.openapi";

const bigintRuntimeSchema: SchemaObject & { "x-runtime-type": "bigint" } = {
	"x-runtime-type": "bigint",
};

const createDocument = (): OpenAPIObject =>
	({
		openapi: "3.0.0",
		info: { title: "test", version: "1" },
		paths: {
			"/users/{userId}": {
				get: {
					responses: {},
					parameters: [
						{
							name: "userId",
							in: "path",
							required: true,
							schema: bigintRuntimeSchema,
						},
					],
				},
			},
			"/oidc-clients/{oidcClientId}": {
				get: {
					responses: {},
					parameters: [
						{
							name: "oidcClientId",
							in: "path",
							required: true,
							schema: { type: "string" },
						},
					],
				},
			},
		},
		components: { schemas: {} },
		tags: [],
		servers: [],
	}) as OpenAPIObject;

describe("applyBigIntIdOpenApiContract", () => {
	it("숫자 ID path parameter를 canonical decimal string으로 문서화해야 한다", () => {
		const document = createDocument();

		applyBigIntIdOpenApiContract(document);

		expect(
			document.paths["/users/{userId}"]?.get?.parameters?.[0],
		).toMatchObject({
			schema: {
				type: "string",
				pattern: DECIMAL_ID_PATTERN_SOURCE,
				"x-runtime-type": "bigint",
			},
		});
	});

	it("OIDC 모델 ULID path parameter는 변경하지 않아야 한다", () => {
		const document = createDocument();

		applyBigIntIdOpenApiContract(document);

		expect(
			document.paths["/oidc-clients/{oidcClientId}"]?.get?.parameters?.[0],
		).toMatchObject({ schema: { type: "string" } });
	});
});
