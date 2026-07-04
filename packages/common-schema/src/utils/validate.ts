import { plainToInstance } from "class-transformer";
import {
	type ValidatorOptions,
	type ValidationError,
	validate,
	validateSync,
} from "class-validator";
import { VALIDATION_MESSAGES } from "../constants";

/**
 * 검증 에러 정보
 */
export interface FieldError {
	/** 필드명 */
	field: string;
	/** 에러 메시지 목록 */
	messages: string[];
}

/**
 * Form UI에서 field path별로 사용하는 validation error map입니다.
 */
export interface FieldErrorMap {
	[path: string]: string | undefined;
}

/**
 * 검증 결과 (성공)
 */
export interface ValidationSuccess<T> {
	isValid: true;
	data: T;
	errors: null;
}

/**
 * 검증 결과 (실패)
 */
export interface ValidationFailure {
	isValid: false;
	data: null;
	errors: FieldError[];
}

/**
 * 검증 결과 타입
 */
export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * 스키마 클래스 생성자 타입
 */
export type SchemaClass<T> = new () => T;

const DEFAULT_VALIDATE_OPTIONS = {
	whitelist: true,
	forbidNonWhitelisted: false,
	skipMissingProperties: false,
} satisfies ValidatorOptions;

function setPathValue(
	target: Record<string, unknown>,
	path: string,
	value: unknown,
) {
	const segments = path.split(".");
	let cursor: Record<string, unknown> = target;

	segments.forEach((segment, index) => {
		if (index === segments.length - 1) {
			cursor[segment] = value;
			return;
		}

		const next = cursor[segment];
		if (!next || typeof next !== "object" || Array.isArray(next)) {
			cursor[segment] = {};
		}
		cursor = cursor[segment] as Record<string, unknown>;
	});
}

function getPathValue(source: unknown, path: string): unknown {
	if (!source || typeof source !== "object") {
		return undefined;
	}

	return path
		.split(".")
		.reduce<unknown>((cursor, segment) => {
			if (!cursor || typeof cursor !== "object") {
				return undefined;
			}

			return (cursor as Record<string, unknown>)[segment];
		}, source);
}

function getConstraintMessages(
	constraints?: Record<string, string>,
): string[] {
	const messages = constraints ? Object.values(constraints) : [];

	return messages.sort((left, right) => {
		if (left === VALIDATION_MESSAGES.REQUIRED) {
			return -1;
		}
		if (right === VALIDATION_MESSAGES.REQUIRED) {
			return 1;
		}
		return 0;
	});
}

/**
 * ValidationError를 FieldError로 변환
 */
function toFieldErrors(
	errors: ValidationError[],
	parentPath?: string,
): FieldError[] {
	return errors.flatMap((error) => {
		const path = parentPath ? `${parentPath}.${error.property}` : error.property;
		const messages = getConstraintMessages(error.constraints);
		const children = error.children?.length
			? toFieldErrors(error.children, path)
			: [];

		if (messages.length === 0) {
			return children;
		}

		return [{ field: path, messages }, ...children];
	});
}

function toFieldErrorMap(errors: FieldError[]): FieldErrorMap {
	return errors.reduce<FieldErrorMap>((fieldErrors, error) => {
		fieldErrors[error.field] = error.messages[0];
		return fieldErrors;
	}, {});
}

/**
 * 스키마를 이용한 데이터 검증
 *
 * plain 객체를 스키마 인스턴스로 변환 후 검증
 *
 * @example
 * ```typescript
 * import { validateSchema, LoginSchema } from '@cocrepo/schema';
 *
 * const result = await validateSchema(LoginSchema, {
 *   email: 'user@example.com',
 *   password: 'password123',
 * });
 *
 * if (result.isValid) {
 *   console.log(result.data); // LoginSchema 인스턴스
 * } else {
 *   console.log(result.errors); // FieldError[]
 * }
 * ```
 */
export async function validateSchema<T extends object>(
	schema: SchemaClass<T>,
	data: unknown,
): Promise<ValidationResult<T>> {
	// plain 객체를 스키마 인스턴스로 변환 (Transform 데코레이터 적용)
	const instance = plainToInstance(schema, data, {
		enableImplicitConversion: true,
		excludeExtraneousValues: false,
	});

	// 검증 실행
	const errors = await validate(instance, {
		...DEFAULT_VALIDATE_OPTIONS,
	});

	if (errors.length > 0) {
		return {
			isValid: false,
			data: null,
			errors: toFieldErrors(errors),
		};
	}

	return {
		isValid: true,
		data: instance,
		errors: null,
	};
}

/**
 * 동기적 스키마 검증 (validateSync 사용)
 *
 * 비동기 검증자가 없는 경우에만 사용
 */
export function validateSchemaSync<T extends object>(
	schema: SchemaClass<T>,
	data: unknown,
): ValidationResult<T> {
	const instance = plainToInstance(schema, data, {
		enableImplicitConversion: true,
		excludeExtraneousValues: false,
	});

	const errors = validateSync(instance, {
		...DEFAULT_VALIDATE_OPTIONS,
	}) as ValidationError[];

	if (errors.length > 0) {
		return {
			isValid: false,
			data: null,
			errors: toFieldErrors(errors),
		};
	}

	return {
		isValid: true,
		data: instance,
		errors: null,
	};
}

/**
 * 단일 필드 검증
 *
 * @example
 * ```typescript
 * const emailError = await validateField(LoginSchema, 'email', 'invalid-email');
 * if (emailError) {
 *   console.log(emailError.messages); // ['유효한 이메일 주소를 입력해주세요.']
 * }
 * ```
 */
export async function validateField<T extends object>(
	schema: SchemaClass<T>,
	field: keyof T,
	value: unknown,
): Promise<FieldError | null> {
	const instance = plainToInstance(schema, { [field]: value });

	const errors = await validate(instance, {
		...DEFAULT_VALIDATE_OPTIONS,
		skipMissingProperties: true, // 다른 필드는 무시
	});

	const fieldError = errors.find((e) => e.property === field);

	if (fieldError) {
		return {
			field: String(field),
			messages: getConstraintMessages(fieldError.constraints),
		};
	}

	return null;
}

/**
 * 단일 field path를 동기적으로 검증합니다.
 *
 * Form field validation에서 사용하며, 다른 required field는 검사하지 않습니다.
 */
export function validateFieldSync<T extends object>(
	schema: SchemaClass<T>,
	state: unknown,
	path: string,
): FieldError | null {
	const value = getPathValue(state, path);
	const data: Record<string, unknown> = {};
	setPathValue(data, path, value);

	const instance = plainToInstance(schema, data, {
		enableImplicitConversion: true,
		excludeExtraneousValues: false,
	});
	const errors = validateSync(instance, {
		...DEFAULT_VALIDATE_OPTIONS,
		skipMissingProperties: true,
	}) as ValidationError[];
	const fieldError = toFieldErrors(errors).find((error) => error.field === path);

	return fieldError ?? null;
}

/**
 * schema 전체 검증 결과를 Form field error map으로 변환합니다.
 */
export function validateSchemaToFieldErrorsSync<T extends object>(
	schema: SchemaClass<T>,
	state: unknown,
): FieldErrorMap {
	const result = validateSchemaSync(schema, state);

	if (result.isValid) {
		return {};
	}

	return toFieldErrorMap(result.errors);
}
