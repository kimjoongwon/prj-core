import type { Type } from "@nestjs/common";
import {
	inheritTransformationMetadata,
	inheritValidationMetadata,
} from "@nestjs/mapped-types";
import { ApiProperty, DECORATORS, PartialType, PickType } from "@nestjs/swagger";
import { QueryDto } from "./query.dto";

/**
 * Entity의 필드 metadata를 QueryDto 하위 클래스에 재사용합니다.
 * Entity의 initializer와 domain method는 복사하지 않습니다.
 */
export function EntityQueryType<
	TEntity extends Type<object>,
	const TKeys extends readonly (keyof InstanceType<TEntity>)[],
>(
	entityClass: TEntity,
	entityKeys: TKeys,
): Type<QueryDto & Partial<Pick<InstanceType<TEntity>, TKeys[number]>>> {
	const mappedEntityType = PartialType(
		PickType(entityClass, entityKeys as unknown as readonly never[]),
		// Query의 기존 Optional 계약은 undefined만 건너뛰고 null은 Entity 정책을 따릅니다.
		{ skipNullProperties: false },
	);

	class EntityQuery extends QueryDto {}
	inheritValidationMetadata(mappedEntityType, EntityQuery);
	inheritTransformationMetadata(mappedEntityType, EntityQuery);

	const modelPropertyKeys = (Reflect.getMetadata(
		DECORATORS.API_MODEL_PROPERTIES_ARRAY,
		mappedEntityType.prototype,
	) ?? []) as string[];
	for (const propertyKey of modelPropertyKeys
		.filter((key) => key.startsWith(":"))
		.map((key) => key.slice(1))) {
		const metadata = Reflect.getMetadata(
			DECORATORS.API_MODEL_PROPERTIES,
			mappedEntityType.prototype,
			propertyKey,
		);
		if (metadata) {
			const queryMetadata = { ...metadata };
			delete queryMetadata.default;
			ApiProperty(queryMetadata)(EntityQuery.prototype, propertyKey);
		}
	}

	return EntityQuery as unknown as Type<
		QueryDto & Partial<Pick<InstanceType<TEntity>, TKeys[number]>>
	>;
}
