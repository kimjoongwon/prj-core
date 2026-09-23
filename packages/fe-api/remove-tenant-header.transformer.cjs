const TENANT_HEADER_NAME = "x-tenant-id";
const fs = require("node:fs");
const path = require("node:path");
const OPERATION_METHODS = new Set([
	"get",
	"put",
	"post",
	"delete",
	"options",
	"head",
	"patch",
	"trace",
]);

const isTenantHeaderParameter = (parameter) =>
	parameter &&
	typeof parameter === "object" &&
	!("$ref" in parameter) &&
	parameter.in === "header" &&
	typeof parameter.name === "string" &&
	parameter.name.toLowerCase() === TENANT_HEADER_NAME;

const withoutTenantHeaderParameters = (parameters) => {
	if (!Array.isArray(parameters)) {
		return parameters;
	}

	const filteredParameters = parameters.filter(
		(parameter) => !isTenantHeaderParameter(parameter),
	);

	return filteredParameters.length > 0 ? filteredParameters : undefined;
};

/**
 * Orval generated clients already receive x-tenant-id from custom Axios
 * interceptors, so the Swagger-only header parameter is stripped for codegen.
 */
const CUSTOM_VALIDATION_KEYS = [
	"each",
	"int",
	"max",
	"message",
	"min",
	"toLowerCase",
];
const UNION_SCHEMA_KEYS = ["allOf", "anyOf", "oneOf"];

/**
 * 공용 validation decorator의 실행 옵션이 Swagger schema에 섞여 나오는 부분을
 * 표준 OpenAPI 3.0 키워드로 정규화한다.
 */
const normalizeSchemaForOpenApi = (schema) => {
	if (!schema || typeof schema !== "object" || Array.isArray(schema)) return;

	if (schema["x-runtime-type"] === "bigint") {
		schema.type = "integer";
		schema.format = "int64";
	}
	if (schema.int === true && schema.type === "number") schema.type = "integer";
	if (schema.min !== undefined && schema.minimum === undefined) {
		schema.minimum = schema.min;
	}
	if (schema.max !== undefined && schema.maximum === undefined) {
		schema.maximum = schema.max;
	}

	for (const validationKey of CUSTOM_VALIDATION_KEYS)
		delete schema[validationKey];

	for (const unionKey of UNION_SCHEMA_KEYS) {
		if (!Array.isArray(schema[unionKey])) continue;
		const hasNullVariant = schema[unionKey].some(
			(unionSchema) => unionSchema?.type === "null",
		);
		if (hasNullVariant) {
			schema[unionKey] = schema[unionKey].filter(
				(unionSchema) => unionSchema?.type !== "null",
			);
			schema.nullable = true;
		}
		for (const unionSchema of schema[unionKey]) {
			normalizeSchemaForOpenApi(unionSchema);
		}
	}

	for (const propertySchema of Object.values(schema.properties ?? {})) {
		normalizeSchemaForOpenApi(propertySchema);
	}
	for (const nestedSchemaKey of [
		"additionalProperties",
		"contains",
		"items",
		"not",
		"propertyNames",
	]) {
		normalizeSchemaForOpenApi(schema[nestedSchemaKey]);
	}
};

const normalizeContentSchemas = (content = {}) => {
	for (const mediaType of Object.values(content)) {
		normalizeSchemaForOpenApi(mediaType?.schema);
	}
};

const normalizeParameterSchema = (parameter) => {
	if (!parameter || typeof parameter !== "object" || "$ref" in parameter)
		return;
	for (const validationKey of CUSTOM_VALIDATION_KEYS)
		delete parameter[validationKey];
	// Parameter에 붙은 x-runtime-type은 프론트의 문자열 query 계약을 유지한다.
	delete parameter.type;
	delete parameter.format;
	normalizeSchemaForOpenApi(parameter.schema);
};

const normalizeOperationSchemas = (operation) => {
	for (const parameter of operation.parameters ?? []) {
		normalizeParameterSchema(parameter);
	}
	normalizeContentSchemas(operation.requestBody?.content);
	for (const response of Object.values(operation.responses ?? {})) {
		normalizeContentSchemas(response?.content);
	}
};

const normalizeSpecSchemas = (spec) => {
	for (const schema of Object.values(spec.components?.schemas ?? {})) {
		normalizeSchemaForOpenApi(schema);
	}
	for (const parameter of Object.values(spec.components?.parameters ?? {})) {
		normalizeParameterSchema(parameter);
	}
	for (const requestBody of Object.values(
		spec.components?.requestBodies ?? {},
	)) {
		normalizeContentSchemas(requestBody?.content);
	}
	for (const response of Object.values(spec.components?.responses ?? {})) {
		normalizeContentSchemas(response?.content);
	}

	for (const pathItem of Object.values(spec.paths ?? {})) {
		if (!pathItem || typeof pathItem !== "object") continue;
		for (const parameter of pathItem.parameters ?? []) {
			normalizeParameterSchema(parameter);
		}
		for (const [method, operation] of Object.entries(pathItem)) {
			if (
				OPERATION_METHODS.has(method) &&
				operation &&
				typeof operation === "object"
			) {
				normalizeOperationSchemas(operation);
			}
		}
	}
};

const responseSchemasByStatus = (responses = {}) =>
	Object.fromEntries(
		Object.entries(responses).flatMap(([status, response]) => {
			const schema = response?.content?.["application/json"]?.schema;
			return schema ? [[status, schema]] : [];
		}),
	);

const createRuntimeManifest = (spec) => {
	const operations = [];
	for (const [operationPath, pathItem] of Object.entries(spec.paths ?? {})) {
		if (!pathItem || typeof pathItem !== "object") continue;
		for (const [method, operation] of Object.entries(pathItem)) {
			if (
				!OPERATION_METHODS.has(method) ||
				!operation ||
				typeof operation !== "object"
			)
				continue;
			const parameters = [
				...(pathItem.parameters ?? []),
				...(operation.parameters ?? []),
			];
			const parameterSchemas = Object.fromEntries(
				parameters.flatMap((parameter) =>
					parameter && !("$ref" in parameter) && parameter.schema
						? [[`${parameter.in}:${parameter.name}`, parameter.schema]]
						: [],
				),
			);
			operations.push({
				operationId:
					operation.operationId ?? `${method.toUpperCase()} ${operationPath}`,
				method: method.toUpperCase(),
				path: operationPath,
				requestSchema:
					operation.requestBody?.content?.["application/json"]?.schema,
				parameterSchemas,
				responseSchemas: responseSchemasByStatus(operation.responses),
			});
		}
	}
	return { operations, schemas: spec.components?.schemas ?? {} };
};

// 스펙이 core·idp 두 프로젝트로 나뉘어 순차 실행되므로 매니페스트는 프로젝트별
// JSON 파편으로 기록하고 merge-runtime-manifest.mjs가 합쳐 최종 TS를 쓴다
// (TS 파일을 재파싱하지 않는다 — biome이 포맷을 바꾸기 때문).
const writeRuntimeManifest = (manifest, spec) => {
	const hasInteractionPaths = Object.keys(spec.paths ?? {}).some((p) =>
		p.startsWith("/api/interaction"),
	);
	const fragmentName = hasInteractionPaths
		? "runtimeManifest.idp.json"
		: "runtimeManifest.core.json";
	fs.writeFileSync(
		path.join(__dirname, "src/libs", fragmentName),
		JSON.stringify(manifest, null, 2),
	);
};

function transformSpecForCodegen(spec, { writeManifest = true } = {}) {
	const nextSpec = JSON.parse(JSON.stringify(spec));
	const paths = nextSpec.paths ?? {};

	for (const pathItem of Object.values(paths)) {
		if (!pathItem || typeof pathItem !== "object") {
			continue;
		}

		if (Array.isArray(pathItem.parameters)) {
			const pathParameters = withoutTenantHeaderParameters(pathItem.parameters);
			if (pathParameters) {
				pathItem.parameters = pathParameters;
			} else {
				delete pathItem.parameters;
			}
		}

		for (const [method, operation] of Object.entries(pathItem)) {
			if (
				!OPERATION_METHODS.has(method) ||
				!operation ||
				typeof operation !== "object" ||
				!Array.isArray(operation.parameters)
			) {
				continue;
			}

			const operationParameters = withoutTenantHeaderParameters(
				operation.parameters,
			);
			if (operationParameters) {
				operation.parameters = operationParameters;
			} else {
				delete operation.parameters;
			}
		}
	}
	normalizeSpecSchemas(nextSpec);
	if (writeManifest)
		writeRuntimeManifest(createRuntimeManifest(nextSpec), nextSpec);

	return nextSpec;
}

module.exports = transformSpecForCodegen;
module.exports.withoutTenantHeaderParameters = withoutTenantHeaderParameters;
module.exports.createRuntimeManifest = createRuntimeManifest;
module.exports.normalizeSchemaForOpenApi = normalizeSchemaForOpenApi;
