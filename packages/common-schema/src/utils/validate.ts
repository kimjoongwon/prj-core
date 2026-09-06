import {
	type ValidationError,
	type ValidatorOptions,
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

	return path.split(".").reduce<unknown>((cursor, segment) => {
		if (!cursor || typeof cursor !== "object") {
			return undefined;
		}

		return (cursor as Record<string, unknown>)[segment];
	}, source);
}

/**
 * 검증 context 값을 `{{variable}}` 형식의 메시지 변수에 치환합니다.
 *
 * @param template 치환할 검증 메시지 템플릿
 * @param values constraint에 등록된 메시지 변수
 * @returns 등록된 변수가 치환된 검증 메시지
 */
function interpolateValidationMessage(
	template: string,
	values?: object,
): string {
	if (!values) {
		return template;
	}

	const messageValues = values as Record<string, unknown>;

	return template.replace(/\{\{(\w+)\}\}/g, (placeholder, key: string) => {
		const value = messageValues[key];
		return value === undefined ? placeholder : String(value);
	});
}

function getConstraintMessages(
	constraints?: Record<string, string>,
	contexts?: ValidationError["contexts"],
): string[] {
	const messages = constraints
		? Object.entries(constraints).map(([constraint, message]) =>
				interpolateValidationMessage(message, contexts?.[constraint]),
			)
		: [];

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
		const path = parentPath
			? `${parentPath}.${error.property}`
			: error.property;
		const messages = getConstraintMessages(error.constraints, error.contexts);
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
	// 원본 값과 타입을 유지한 채 검증 인스턴스를 생성합니다.
	const instance = Object.assign(new schema(), data);

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
	const instance = Object.assign(new schema(), data);

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
	const instance = Object.assign(new schema(), { [field]: value });

	const errors = await validate(instance, {
		...DEFAULT_VALIDATE_OPTIONS,
		skipMissingProperties: true, // 다른 필드는 무시
	});

	const fieldError = errors.find((e) => e.property === field);

	if (fieldError) {
		return {
			field: String(field),
			messages: getConstraintMessages(
				fieldError.constraints,
				fieldError.contexts,
			),
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

	const instance = Object.assign(new schema(), data);
	const errors = validateSync(instance, {
		...DEFAULT_VALIDATE_OPTIONS,
		skipMissingProperties: true,
	}) as ValidationError[];
	const fieldError = toFieldErrors(errors).find(
		(error) => error.field === path,
	);

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
