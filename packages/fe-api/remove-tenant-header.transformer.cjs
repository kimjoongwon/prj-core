const TENANT_HEADER_NAME = "x-tenant-id";
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
function removeTenantHeaderParameters(spec) {
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

	return nextSpec;
}

module.exports = removeTenantHeaderParameters;
module.exports.withoutTenantHeaderParameters = withoutTenantHeaderParameters;
