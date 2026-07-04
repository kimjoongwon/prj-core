import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import type { ClassConstructor } from "class-transformer/types/interfaces";
import { validateSync } from "class-validator";

type EnumClassLike = {
	prototype?: unknown;
	values?: () => Array<{ code?: string }>;
};

export class ValidationUtil {
	static validateConfig<T extends object>(
		config: Record<string, unknown>,
		envVariablesClass: ClassConstructor<T>,
	) {
		const validatedConfig = plainToClass(envVariablesClass, config, {
			enableImplicitConversion: true,
		});
		const errors = validateSync(validatedConfig, {
			skipMissingProperties: false,
		});

		if (errors.length > 0) {
			throw new Error(errors.toString());
		}
		return validatedConfig;
	}
	static getVariableName<TResult>(getVar: () => TResult): string | undefined {
		const m = /\(\)=>(.*)/.exec(
			getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ""),
		);

		if (!m) {
			throw new Error(
				"The function does not contain a statement matching 'return variableName;'",
			);
		}

		const fullMemberName = m[1];

		const memberParts = fullMemberName.split(".");

		return memberParts[memberParts.length - 1];
	}
}

export function ApiBooleanProperty(
	options: ApiPropertyOptions = {},
): PropertyDecorator {
	return ApiProperty({ type: "boolean", ...options });
}

export function ApiBooleanPropertyOptional(
	options: Omit<ApiPropertyOptions, "type" | "required"> = {},
): PropertyDecorator {
	return ApiBooleanProperty({ required: false, ...options });
}

export function ApiUUIDProperty(
	options: ApiPropertyOptions & Partial<{ each: boolean }> = {},
): PropertyDecorator {
	const { each, ...propertyOptions } = options;

	return ApiProperty({
		type: each ? [String] : "string",
		pattern:
			"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|[A-Za-z0-9_-]{22})$",
		isArray: each,
		...propertyOptions,
	});
}

export function ApiUUIDPropertyOptional(
	options: Omit<ApiPropertyOptions, "type" | "format" | "required"> &
		Partial<{ each: boolean }> = {},
): PropertyDecorator {
	return ApiUUIDProperty({ required: false, ...options });
}

export function ApiEnumProperty<TEnum>(
	getEnum: () => TEnum,
	options: ApiPropertyOptions & { each?: boolean } = {},
): PropertyDecorator {
	const enumValue = getEnum() as unknown;

	// Prisma 7: enums are plain objects, extract values for Swagger
	// ts-jenum: class-based enums need special handling
	// Prisma 6 & native TS enums: already in correct format
	let enumForSwagger: Record<string, unknown> | string[] = [];

	// Check if it's a class constructor (ts-jenum)
	if (typeof enumValue === "function" && "prototype" in enumValue) {
		const enumClass = enumValue as EnumClassLike;
		// ts-jenum class: call static values() method if available
		if (typeof enumClass.values === "function") {
			// ts-jenum values()는 인스턴스 배열을 반환하므로 code 값(문자열)만 추출
			const instances = enumClass.values();
			enumForSwagger = instances
				.map((instance) => instance.code)
				.filter((code): code is string => typeof code === "string");
		}
	} else if (
		enumValue &&
		typeof enumValue === "object" &&
		!Array.isArray(enumValue)
	) {
		// Check if it's a Prisma 7 plain object enum (has string values)
		const values = Object.values(enumValue);
		if (values.length > 0 && values.every((v) => typeof v === "string")) {
			// It's a Prisma 7 enum - use the values array
			enumForSwagger = values as string[];
		} else {
			enumForSwagger = enumValue as Record<string, unknown>;
		}
	}

	return ApiProperty({
		// throw error during the compilation of swagger
		// isArray: options.each,
		enum: enumForSwagger,
		enumName: ValidationUtil.getVariableName(getEnum),
		...options,
	});
}

export function ApiEnumPropertyOptional<TEnum>(
	getEnum: () => TEnum,
	options: Omit<ApiPropertyOptions, "type" | "required"> & {
		each?: boolean;
	} = {},
): PropertyDecorator {
	return ApiEnumProperty(getEnum, { required: false, ...options });
}
