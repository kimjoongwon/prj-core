import {
	CLASS_FIELD_OPTIONS_METADATA,
	type ClassFieldOptionsMetadata,
} from "@cocrepo/decorator/field";
import type { Type as Constructor } from "@nestjs/common";
import {
	ApiProperty,
	type ApiPropertyOptions,
	PickType,
} from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import type { BaseEntityFields } from "@cocrepo/type";
import {
	ENTITY_RESPONSE_TYPE_METADATA,
	type EntityResponseMetadata,
} from "./entity-response.metadata";
import { prepareEntityResponseType } from "./prepare-entity-response-type";

type ResponseKey<Entity extends object> = Extract<
	keyof Entity | keyof BaseEntityFields,
	string
>;

export type EntityResponseTypeOptions<
	Entity extends object,
	Keys extends ResponseKey<Entity>,
	RelationKeys extends Keys = never,
> = {
	pick: readonly Keys[];
	// callback의 반환 클래스를 검사하면 자기 참조 DTO의 base 추론이 순환합니다.
	// 여기서는 키만 추론하고 callback과 대상 클래스는 아래에서 검증합니다.
	relations?: Partial<Record<RelationKeys, unknown>>;
	extraFields?: readonly string[];
};

export type EntityResponseShape<
	Entity extends object,
	Keys extends ResponseKey<Entity>,
	RelationKeys extends Keys = never,
	ExtraKeys extends string = never,
> = Omit<Pick<Entity, Extract<Keys, keyof Entity>>, RelationKeys> &
	Partial<Pick<BaseEntityFields, Extract<Keys, keyof BaseEntityFields>>> &
	Partial<Record<ExtraKeys, unknown>> &
	Partial<Record<RelationKeys, unknown>>;

/**
 * Entity의 공개 필드와 메타데이터를 응답 계약으로 선택합니다.
 * 관계 callback의 반환 타입은 base 타입에 추론하지 않으며 DTO에서 declare로 좁힙니다.
 * concrete subclass의 제외 전략은 응답 변환 전에 prepareEntityResponseType이 적용합니다.
 */
export function EntityResponseType<
	Entity extends object,
	Keys extends ResponseKey<Entity>,
	RelationKeys extends Keys = never,
>(
	entity: Constructor<Entity>,
	options: EntityResponseTypeOptions<Entity, Keys, RelationKeys>,
): Constructor<EntityResponseShape<Entity, Keys, RelationKeys>> {
	const ResponseType = PickType(
		entity,
		options.pick as readonly (keyof Entity)[],
	);
	const responseRelations: Record<string, () => Constructor<object>> = {};
	for (const [propertyKey, relationCallback] of Object.entries(
		options.relations ?? {},
	)) {
		if (relationCallback === undefined) continue;
		if (typeof relationCallback !== "function") {
			throw new TypeError(
				`Response relation must be a callback: ${propertyKey}`,
			);
		}
		responseRelations[propertyKey] = () => {
			const RelationClass: unknown = relationCallback();
			if (typeof RelationClass !== "function" || !RelationClass.prototype) {
				throw new TypeError(
					`Response relation callback must return a class: ${propertyKey}`,
				);
			}
			return RelationClass as Constructor<object>;
		};
	}
	const responseMetadata: EntityResponseMetadata = {
		relations: responseRelations,
	};
	Reflect.defineMetadata(
		ENTITY_RESPONSE_TYPE_METADATA,
		responseMetadata,
		ResponseType,
	);
	Exclude()(ResponseType);

	for (const propertyKey of [...options.pick, ...(options.extraFields ?? [])]) {
		Expose()(ResponseType.prototype, propertyKey);
	}

	for (const [propertyKey, getRelation] of Object.entries(
		responseMetadata.relations,
	)) {
		if (!getRelation) continue;
		const metadata = Reflect.getMetadata(
			CLASS_FIELD_OPTIONS_METADATA,
			entity.prototype,
			propertyKey,
		) as ClassFieldOptionsMetadata | undefined;
		if (!metadata) {
			throw new Error(
				`Entity relation metadata is missing: ${entity.name}.${propertyKey}`,
			);
		}

		// PickType이 복사한 검증·변환 규칙은 유지하고 중첩 대상만 교체합니다.
		Type(() => {
			const RelationType = getRelation();
			prepareEntityResponseType(RelationType, true);
			return RelationType;
		})(ResponseType.prototype, propertyKey);
		if (metadata.apiPropertyOptions) {
			ApiProperty({
				...metadata.apiPropertyOptions,
				type: () => getRelation(),
			} as ApiPropertyOptions)(ResponseType.prototype, propertyKey);
		}
	}

	return ResponseType as Constructor<
		EntityResponseShape<Entity, Keys, RelationKeys>
	>;
}
