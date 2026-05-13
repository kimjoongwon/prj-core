import { plainToInstance } from "class-transformer";

type Constructor<T = object> = new (...args: never[]) => T;

interface TransformToDtoOptions {
	isArray?: boolean;
	excludeFields?: readonly string[];
}

const removeExcludedFields = <T>(value: T, excludeFields: readonly string[]): T => {
	if (!value || typeof value !== "object" || excludeFields.length === 0) {
		return value;
	}

	for (const field of excludeFields) {
		delete (value as Record<string, unknown>)[field];
	}

	return value;
};

export const isEntity = (value: unknown): value is object =>
	Boolean(
		value &&
			typeof value === "object" &&
			("toDto" in value ||
				("id" in value && "createdAt" in value && "updatedAt" in value)),
	);

export const transformToDto = <T>(
	dtoClass: Constructor<T>,
	data: unknown,
	options: TransformToDtoOptions = {},
): T | T[] => {
	const excludeFields = options.excludeFields ?? [];

	if (options.isArray) {
		const items = Array.isArray(data) ? data : [];
		return plainToInstance(dtoClass, items).map((item) =>
			removeExcludedFields(item, excludeFields),
		);
	}

	const dto = plainToInstance(dtoClass, data);
	return removeExcludedFields(dto, excludeFields);
};
