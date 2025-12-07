import { ApiProperty, type ApiPropertyOptions } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { ClassConstructor } from "class-transformer/types/interfaces";
import { validateSync } from "class-validator";

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
	return ApiProperty({
		type: options.each ? [String] : "string",
		format: "uuid",
		isArray: options.each,
		...options,
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const enumValue = getEnum() as any;

	// Prisma 7: enums are plain objects, extract values for Swagger
	// ts-jenum: class-based enums need special handling
	// Prisma 6 & native TS enums: already in correct format
	let enumForSwagger = enumValue;

	// Check if it's a class constructor (ts-jenum)
	if (typeof enumValue === 'function' && enumValue.prototype) {
		// ts-jenum class: call static values() method if available
		if (typeof enumValue.values === 'function') {
			enumForSwagger = enumValue.values();
		}
	} else if (enumValue && typeof enumValue === 'object' && !Array.isArray(enumValue)) {
		// Check if it's a Prisma 7 plain object enum (has string values)
		const values = Object.values(enumValue);
		if (values.length > 0 && values.every(v => typeof v === 'string')) {
			// It's a Prisma 7 enum - use the values array
			enumForSwagger = values;
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
