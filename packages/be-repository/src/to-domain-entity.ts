import type { DomainData } from "@cocrepo/entity";
import type { ClassConstructor } from "class-transformer";
import { plainToInstance } from "class-transformer";

type PersistenceRecord = Record<string, unknown>;

/**
 * Prisma 조회 결과를 공개 ID 기반 도메인 객체로 변환합니다.
 *
 * 데이터베이스 내부 필드인 `seq`와 `*Seq`는 제거하고, 함께 조회한 단일 관계의
 * 공개 `id`를 대응하는 `*Id` 필드로 복원합니다.
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
 * 클래스 변환이 필요 없는 projection에서 내부 순번을 제거하고 공개 관계 ID를 복원합니다.
 */
export function toDomainData<T>(value: T): DomainData<T> {
	return normalizePersistenceValue(value) as DomainData<T>;
}

/**
 * Prisma 내부 순번을 제거하고 포함된 관계의 공개 ID를 평탄화합니다.
 */
function normalizePersistenceValue(value: unknown): unknown {
	if (value instanceof Date || value === null || typeof value !== "object") {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => normalizePersistenceValue(item));
	}

	const source = value as PersistenceRecord;
	const normalized: PersistenceRecord = {};

	for (const [key, item] of Object.entries(source)) {
		if (key === "seq" || key.endsWith("Seq")) {
			continue;
		}

		normalized[key] = normalizePersistenceValue(item);
	}

	for (const key of Object.keys(source)) {
		if (key === "seq" || !key.endsWith("Seq")) {
			continue;
		}

		const relationName = key.slice(0, -"Seq".length);
		const relationProperty = Object.hasOwn(source, relationName)
			? relationName
			: relationName.replace(/[A-Z][a-zA-Z0-9]*$/, "");
		if (!relationProperty || !Object.hasOwn(source, relationProperty)) {
			continue;
		}

		const relation = source[relationProperty];
		const relationId =
			relation !== null &&
			typeof relation === "object" &&
			"id" in relation &&
			typeof relation.id === "string"
				? relation.id
				: null;

		normalized[`${relationName}Id`] = relationId;
	}

	return normalized;
}
