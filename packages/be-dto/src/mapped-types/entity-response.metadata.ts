import type { Type } from "@nestjs/common";

/** 응답 변환 경계가 Entity 기반 DTO와 그 상속 클래스를 식별하는 키입니다. */
export const ENTITY_RESPONSE_TYPE_METADATA = "cocrepo:dto:entity-response";

export interface EntityResponseMetadata {
	readonly relations: Readonly<Partial<Record<string, () => Type<object>>>>;
}

export function isEntityResponseType(responseClass: object): boolean {
	return Reflect.hasMetadata(ENTITY_RESPONSE_TYPE_METADATA, responseClass);
}
