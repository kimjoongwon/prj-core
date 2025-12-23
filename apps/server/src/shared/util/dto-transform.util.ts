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
	options?: { isArray?: boolean },
): T | T[] | unknown {
	// null/undefined 처리
	if (data === null || data === undefined) {
		return data;
	}

	// 배열 처리
	if (options?.isArray && Array.isArray(data)) {
		return data.map((item) =>
			isEntity(item) ? plainToInstance(dtoClass, item) : item,
		);
	}

	// 단일 Entity 처리
	if (isEntity(data)) {
		return plainToInstance(dtoClass, data);
	}

	// Entity가 아니면 원본 반환
	return data;
}
