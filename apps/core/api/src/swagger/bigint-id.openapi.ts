import { DECIMAL_ID_PATTERN_SOURCE } from "@cocrepo/type";
import type {
	OpenAPIObject,
	OperationObject,
	ParameterObject,
	ReferenceObject,
} from "@nestjs/swagger";

const PROTOCOL_PATH_ID_NAMES = new Set(["grantId", "oidcClientId"]);
const HTTP_OPERATION_KEYS = [
	"get",
	"put",
	"post",
	"delete",
	"options",
	"head",
	"patch",
	"trace",
] as const;

const isReferenceObject = (
	parameter: ParameterObject | ReferenceObject,
): parameter is ReferenceObject => "$ref" in parameter;

const isDatabaseIdPathParameter = (parameter: ParameterObject): boolean =>
	parameter.in === "path" &&
	(parameter.name === "id" || parameter.name.endsWith("Id")) &&
	!PROTOCOL_PATH_ID_NAMES.has(parameter.name);

/**
 * 숫자 DB ID를 받는 REST path parameter에 canonical signed BIGINT 문자열
 * 스키마를 적용합니다. OIDC와 grant 같은 프로토콜 식별자는 그대로 둡니다.
 */
export function applyBigIntIdOpenApiContract(document: OpenAPIObject): void {
	for (const pathItem of Object.values(document.paths)) {
		for (const operationKey of HTTP_OPERATION_KEYS) {
			const operation = pathItem?.[operationKey] as OperationObject | undefined;
			if (!operation) continue;

			for (const parameter of operation.parameters ?? []) {
				if (
					isReferenceObject(parameter) ||
					!isDatabaseIdPathParameter(parameter)
				) {
					continue;
				}

				parameter.schema = {
					...(parameter.schema ?? {}),
					type: "string",
					pattern: DECIMAL_ID_PATTERN_SOURCE,
				};
			}
		}
	}
}
