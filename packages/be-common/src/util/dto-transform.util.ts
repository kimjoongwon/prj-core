import { AbstractEntity } from "@cocrepo/entity";
import { plainToInstance } from "class-transformer";

/**
 * 값이 AbstractEntity 인스턴스인지 확인
 * @param value 확인할 값
 * @returns AbstractEntity 인스턴스이면 true
 */
export function isEntity(value: unknown): value is AbstractEntity {
	return value instanceof AbstractEntity;
}

/**
 * Entity를 DTO로 변환
 * @param dtoClass 변환할 DTO 클래스
 * @param data 변환할 데이터 (Entity 또는 배열)
 * @param options 변환 옵션
 * @returns 변환된 DTO 또는 원본 데이터
 */
export function transformToDto<T>(
	dtoClass: new (...args: any[]) => T,
	data: unknown,
	options?: {
		isArray?: boolean;
		excludeFields?: string[];
	},
): T | T[] | unknown {
	// null/undefined 처리
	if (data === null || data === undefined) {
		return data;
	}

	// Primitive 타입은 변환 불필요
	if (typeof data !== "object") {
		return data;
	}

	// plainToInstance로 변환 (항상 시도)
	const transformed =
		options?.isArray && Array.isArray(data)
			? data.map((item) =>
					typeof item === "object" && item !== null
						? plainToInstance(dtoClass, item)
						: item,
				)
			: plainToInstance(dtoClass, data);

	// excludeFields가 있으면 필드 제거
	if (options?.excludeFields && options.excludeFields.length > 0) {
		return excludeFieldsFromDto(transformed, options.excludeFields);
	}

	return transformed;
}

/**
 * DTO 또는 DTO 배열에서 특정 필드 제거
 */
function excludeFieldsFromDto<T>(
	data: T | T[],
	fieldsToExclude: string[],
): T | T[] {
	if (Array.isArray(data)) {
		return data.map((item) => removeFields(item, fieldsToExclude)) as T[];
	}
	return removeFields(data, fieldsToExclude) as T;
}

/**
 * 객체에서 특정 필드들을 제거
 */
function removeFields<T>(obj: T, fields: string[]): Partial<T> {
	if (!obj || typeof obj !== "object") return obj;

	// 클래스 인스턴스를 일반 객체로 변환
	const plainObj = JSON.parse(JSON.stringify(obj));

	for (const field of fields) {
		delete plainObj[field];
	}
	return plainObj as Partial<T>;
}
