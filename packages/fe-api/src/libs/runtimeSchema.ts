export interface RuntimeSchema {
	[key: string]: unknown;
	$ref?: string;
	type?: string;
	format?: string;
	nullable?: boolean;
	"x-runtime-type"?: string;
	properties?: Record<string, RuntimeSchema>;
	items?: RuntimeSchema;
	allOf?: RuntimeSchema[];
}

export interface RuntimeOperation {
	operationId: string;
	method: string;
	path: string;
	requestSchema?: RuntimeSchema;
	parameterSchemas: Record<string, RuntimeSchema>;
	responseSchemas: Record<string, RuntimeSchema>;
}

export interface RuntimeManifest {
	operations: RuntimeOperation[];
	schemas: Record<string, RuntimeSchema>;
}

type RuntimeDirection = "request" | "response";

const operationPathPattern = (operationPath: string) =>
	new RegExp(`^${operationPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{[^/]+\\\}/g, "[^/]+")}/?$`);

const resolveSchema = (schema: RuntimeSchema, manifest: RuntimeManifest): RuntimeSchema => {
	if (!schema.$ref) return schema;
	const schemaReferenceSegments = schema.$ref.split("/");
	const schemaName = schemaReferenceSegments[schemaReferenceSegments.length - 1];
	const resolvedSchema = schemaName ? manifest.schemas[schemaName] : undefined;
	if (!resolvedSchema) throw new Error(`unresolved schema reference ${schema.$ref}`);
	return resolvedSchema;
};

const convertRuntimeValue = (
	value: unknown,
	schema: RuntimeSchema,
	manifest: RuntimeManifest,
	direction: RuntimeDirection,
	operationId: string,
	fieldPath: string,
): unknown => {
	if (value == null && schema.nullable) return value;
	try {
		const resolvedSchema = resolveSchema(schema, manifest);
		if (resolvedSchema.allOf) {
			return resolvedSchema.allOf.reduce(
				(convertedValue, memberSchema) => convertRuntimeValue(convertedValue, memberSchema, manifest, direction, operationId, fieldPath),
				value,
			);
		}
		if (resolvedSchema.type === "array" && Array.isArray(value) && resolvedSchema.items) {
			return value.map((item, index) => convertRuntimeValue(item, resolvedSchema.items!, manifest, direction, operationId, `${fieldPath}[${index}]`));
		}
		if (resolvedSchema.format === "date-time") {
			if (direction === "request") {
				if (!(value instanceof Date) || Number.isNaN(value.getTime())) throw new Error("expected a valid Date");
				return value.toISOString();
			}
			if (typeof value !== "string") throw new Error("expected an ISO date-time string");
			const dateValue = new Date(value);
			if (Number.isNaN(dateValue.getTime())) throw new Error("invalid date-time string");
			return dateValue;
		}
		if (resolvedSchema["x-runtime-type"] === "bigint") {
			if (direction === "request") {
				if (typeof value !== "bigint") throw new Error("expected a bigint");
				return value.toString(10);
			}
			if (typeof value !== "string" && typeof value !== "number") throw new Error("expected an integer string");
			return BigInt(value);
		}
		if (value && typeof value === "object" && resolvedSchema.properties) {
			const convertedObject = { ...(value as Record<string, unknown>) };
			for (const [propertyName, propertySchema] of Object.entries(resolvedSchema.properties)) {
				if (propertyName in convertedObject) convertedObject[propertyName] = convertRuntimeValue(convertedObject[propertyName], propertySchema, manifest, direction, operationId, `${fieldPath}.${propertyName}`);
			}
			return convertedObject;
		}
		return value;
	} catch (error) {
		if (error instanceof Error && error.message.startsWith(`Runtime conversion failed for ${operationId}`)) throw error;
		throw new Error(`Runtime conversion failed for ${operationId} at ${fieldPath}: ${error instanceof Error ? error.message : String(error)}`);
	}
};

export const findRuntimeOperation = (manifest: RuntimeManifest, method: string | undefined, url: string | undefined) => {
	if (!method || !url) return undefined;
	const pathname = new URL(url, "http://runtime.local").pathname;
	return manifest.operations.find((operation) => operation.method === method.toUpperCase() && operationPathPattern(operation.path).test(pathname));
};

export const transformResponseData = (data: unknown, status: number, method: string | undefined, url: string | undefined, manifest: RuntimeManifest) => {
	const operation = findRuntimeOperation(manifest, method, url);
	if (!operation) return data;
	const schema = operation.responseSchemas[String(status)] ?? operation.responseSchemas.default;
	return schema ? convertRuntimeValue(data, schema, manifest, "response", operation.operationId, "response.body") : data;
};
