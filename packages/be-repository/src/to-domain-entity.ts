import type { DomainData } from "@cocrepo/entity";
import type { ClassConstructor } from "class-transformer";
import { plainToInstance } from "class-transformer";

/**
 * Prisma 조회 결과를 도메인 객체로 변환합니다.
 */
export function toDomainEntity<T>(
	entityType: ClassConstructor<T>,
	value: unknown[],
): T[];
export function toDomainEntity<T>(
	entityType: ClassConstructor<T>,
	value: unknown,
): T;
export function toDomainEntity<T>(
	entityType: ClassConstructor<T>,
	value: unknown | unknown[],
): T | T[] {
	return plainToInstance(entityType, toDomainData(value));
}

/**
 * 클래스 변환이 필요 없는 projection 결과를 그대로 반환합니다.
 */
export function toDomainData<T>(value: T): DomainData<T> {
	return value as DomainData<T>;
}
