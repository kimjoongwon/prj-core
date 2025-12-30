import { plainToInstance } from "class-transformer";
import { type ValidationError, validate } from "class-validator";

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

/**
 * ValidationError를 FieldError로 변환
 */
function toFieldErrors(errors: ValidationError[]): FieldError[] {
	return errors.map((error) => ({
		field: error.property,
		messages: error.constraints ? Object.values(error.constraints) : [],
	}));
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
		whitelist: true,
		forbidNonWhitelisted: false,
		skipMissingProperties: false,
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
	const { validateSync } = require("class-validator");

	const instance = plainToInstance(schema, data, {
		enableImplicitConversion: true,
		excludeExtraneousValues: false,
	});

	const errors = validateSync(instance, {
		whitelist: true,
		forbidNonWhitelisted: false,
		skipMissingProperties: false,
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
		whitelist: true,
		skipMissingProperties: true, // 다른 필드는 무시
	});

	const fieldError = errors.find((e) => e.property === field);

	if (fieldError) {
		return {
			field: String(field),
			messages: fieldError.constraints
				? Object.values(fieldError.constraints)
				: [],
		};
	}

	return null;
}
