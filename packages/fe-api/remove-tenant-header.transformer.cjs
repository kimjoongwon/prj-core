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
const normalizeBigIntSchemas = (node) => {
	if (!node || typeof node !== "object") return;
	if (node["x-runtime-type"] === "bigint") {
		node.type = "integer";
		node.format = "int64";
	}
	for (const child of Object.values(node)) normalizeBigIntSchemas(child);
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
			if (!OPERATION_METHODS.has(method) || !operation || typeof operation !== "object") continue;
			const parameters = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])];
			const parameterSchemas = Object.fromEntries(
				parameters.flatMap((parameter) =>
					parameter && !("$ref" in parameter) && parameter.schema
						? [[`${parameter.in}:${parameter.name}`, parameter.schema]]
						: [],
			),
			);
			operations.push({
				operationId: operation.operationId ?? `${method.toUpperCase()} ${operationPath}`,
				method: method.toUpperCase(),
				path: operationPath,
				requestSchema: operation.requestBody?.content?.["application/json"]?.schema,
				parameterSchemas,
				responseSchemas: responseSchemasByStatus(operation.responses),
			});
		}
	}
	return { operations, schemas: spec.components?.schemas ?? {} };
};

const writeRuntimeManifest = (manifest) => {
	const target = path.join(__dirname, "src/libs/runtimeManifest.ts");
	const source = `// Orval input transformer가 codegen 시 갱신합니다.\nimport type { RuntimeManifest } from "./runtimeSchema";\n\nexport const runtimeManifest: RuntimeManifest = ${JSON.stringify(manifest, null, 2)};\n`;
	fs.writeFileSync(target, source);
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
	normalizeBigIntSchemas(nextSpec);
	if (writeManifest) writeRuntimeManifest(createRuntimeManifest(nextSpec));

	return nextSpec;
}

module.exports = transformSpecForCodegen;
module.exports.withoutTenantHeaderParameters = withoutTenantHeaderParameters;
module.exports.createRuntimeManifest = createRuntimeManifest;
