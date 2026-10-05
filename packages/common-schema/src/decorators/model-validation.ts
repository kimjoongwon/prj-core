import {
	DEFAULT_PASSWORD_MAX_LENGTH,
	DEFAULT_PASSWORD_MIN_LENGTH,
} from "@cocrepo/constant/auth/password-rules";
import { DATABASE_ID_MAX, DATABASE_ID_MIN } from "@cocrepo/type/database-id";
import {
	IsBoolean,
	IsDate,
	IsDefined,
	IsEmail,
	IsEnum,
	IsInt,
	IsNumber,
	IsObject,
	IsOptional,
	IsPhoneNumber,
	IsPositive,
	IsString,
	IsUrl,
	Matches,
	Max,
	MaxLength,
	Min,
	MinLength,
	NotEquals,
	registerDecorator,
	ValidateIf,
	ValidateNested,
} from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

/** 저장 모델과 API 입력이 공유하는 값 검증 옵션입니다. 변환·문서화는 수행하지 않습니다. */
export interface ModelValidationOptions {
	nullable?: boolean;
	each?: boolean;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	message?: string;
	description?: string;
	min?: number;
	max?: number;
	minimum?: number;
	maximum?: number;
	int?: boolean;
	isPositive?: boolean;
}
function nullValidation(options: ModelValidationOptions): PropertyDecorator {
	return options.nullable
		? ValidateIf((_object, fieldValue) => fieldValue !== null, {
				each: options.each,
			})
		: NotEquals(null, { each: options.each });
}
function optionalValidation(
	validator: (options?: ModelValidationOptions) => PropertyDecorator,
) {
	return (options: ModelValidationOptions = {}): PropertyDecorator =>
		applyDecorators(
			ValidateIf((_object, fieldValue) => fieldValue !== undefined),
			validator(options),
		);
}
export function StringValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	const decorators = [
		IsString({ each: options.each, message: VALIDATION_MESSAGES.STRING_TYPE }),
		nullValidation(options),
		MinLength(options.minLength || 1, { each: options.each }),
	];
	if (options.maxLength)
		decorators.push(MaxLength(options.maxLength, { each: options.each }));
	if (options.pattern)
		decorators.push(
			Matches(new RegExp(options.pattern), {
				each: options.each,
				message:
					options.message ||
					`${options.description || "값"}이 올바른 형식이 아닙니다`,
			}),
		);
	return applyDecorators(...decorators);
}
export const StringValidationOptional = optionalValidation(StringValidation);
export function NumberValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	const decorators = [
		nullValidation(options),
		options.int
			? IsInt({ each: options.each })
			: IsNumber({}, { each: options.each }),
	];
	const minimum = options.min ?? options.minimum;
	const maximum = options.max ?? options.maximum;
	if (typeof minimum === "number")
		decorators.push(Min(minimum, { each: options.each }));
	if (typeof maximum === "number")
		decorators.push(Max(maximum, { each: options.each }));
	if (options.isPositive) decorators.push(IsPositive({ each: options.each }));
	return applyDecorators(...decorators);
}
export const NumberValidationOptional = optionalValidation(NumberValidation);
export function BooleanValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsBoolean(),
		nullValidation({ ...options, each: undefined }),
	);
}
export const BooleanValidationOptional = optionalValidation(BooleanValidation);
export function DateValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsDate(),
		nullValidation({ ...options, each: undefined }),
	);
}
export const DateValidationOptional = optionalValidation(DateValidation);
export function BigIntIdValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(
		(target, propertyName) =>
			registerDecorator({
				name: "isDatabaseId",
				target: target.constructor,
				propertyName: propertyName as string,
				options: {
					each: options.each,
					message:
						"$property must be a canonical positive signed-BIGINT decimal string",
				},
				validator: {
					validate: (fieldValue: unknown) =>
						typeof fieldValue === "bigint" &&
						fieldValue >= DATABASE_ID_MIN &&
						fieldValue <= DATABASE_ID_MAX,
				},
			}),
		nullValidation(options),
	);
}
export const BigIntIdValidationOptional =
	optionalValidation(BigIntIdValidation);
export function ULIDValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(
		Matches(/^[0-9A-HJKMNP-TV-Z]{26}$/, {
			each: options.each,
			message: "$property must be a valid ULID",
		}),
		nullValidation({ ...options, each: undefined }),
	);
}
export const ULIDValidationOptional = optionalValidation(ULIDValidation);
/** 기존 UUIDField 계약은 null 여부만 검증합니다. UUID 형식 규칙을 임의로 추가하지 않습니다. */
export function UUIDValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return nullValidation({ ...options, each: undefined });
}
export const UUIDValidationOptional = optionalValidation(UUIDValidation);
export function EnumValidation<TEnum extends object>(
	getEnum: () => TEnum,
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsEnum(getEnum(), { each: options.each }),
		nullValidation({ ...options, each: undefined }),
	);
}
export function EnumValidationOptional<TEnum extends object>(
	getEnum: () => TEnum,
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(
		ValidateIf((_object, fieldValue) => fieldValue !== undefined),
		EnumValidation(getEnum, options),
	);
}
export function EmailValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(IsEmail(), StringValidation(options));
}
export const EmailValidationOptional = optionalValidation(EmailValidation);
export function PhoneValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsPhoneNumber(undefined, { message: "error.phoneNumber" }),
		nullValidation({ ...options, each: undefined }),
	);
}
export const PhoneValidationOptional = optionalValidation(PhoneValidation);
export function URLValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(StringValidation(options), IsUrl({}, { each: true }));
}
export const URLValidationOptional = optionalValidation(URLValidation);
export function TmpKeyValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(StringValidation(options), (target, propertyName) =>
		registerDecorator({
			name: "tmpKey",
			target: target.constructor,
			propertyName: propertyName as string,
			options: { each: options.each },
			validator: {
				validate: (fieldValue: unknown) =>
					typeof fieldValue === "string" && /^tmp\//.test(fieldValue),
				defaultMessage: () => "error.invalidTmpKey",
			},
		}),
	);
}
export const TmpKeyValidationOptional = optionalValidation(TmpKeyValidation);
export function PasswordValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	return applyDecorators(
		StringValidation({
			...options,
			minLength: options.minLength ?? DEFAULT_PASSWORD_MIN_LENGTH,
			maxLength: options.maxLength ?? DEFAULT_PASSWORD_MAX_LENGTH,
		}),
		(target, propertyName) =>
			registerDecorator({
				name: "isPassword",
				target: target.constructor,
				propertyName: propertyName as string,
				validator: {
					validate: (fieldValue: string) =>
						/^[\d!#$%&*@A-Z^a-z]*$/.test(fieldValue),
				},
			}),
	);
}
export const PasswordValidationOptional =
	optionalValidation(PasswordValidation);

/** 저장된 해시는 평문 입력 규칙 없이 문자열 타입만 확인합니다. */
export function StoredStringValidation(): PropertyDecorator {
	return IsString();
}
/** JSON scalar의 기존 ClassField 검증 계약을 보존합니다. 관계 타입 변환은 Entity가 담당합니다. */
export function ClassValidation(
	options: ModelValidationOptions = {},
): PropertyDecorator {
	const decorators = [
		ValidateNested({ each: options.each }),
		nullValidation({ ...options, each: undefined }),
	];
	if (options.required !== false) decorators.push(IsDefined());
	return applyDecorators(...decorators);
}

/** OIDC 로그인 UI의 선택적인 JSON 객체 계약입니다. */
export function ObjectValidationOptional(): PropertyDecorator {
	return applyDecorators(IsOptional(), IsObject());
}
