import type { Type } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { DECORATORS } from "@nestjs/swagger/dist/constants";
import { Exclude, Expose } from "class-transformer";
import {
	ENTITY_RESPONSE_TYPE_METADATA,
	type EntityResponseMetadata,
} from "./entity-response.metadata";

/**
 * 변환 전에 concrete 응답 DTO의 제외 전략을 준비합니다.
 * 일반 DTO는 그대로 두고 Entity 응답 및 명시적으로 선택한 API 관계만 제한합니다.
 * Swagger 관계 탐색은 일반 wrapper 안의 Entity 응답에도 같은 정책을 적용합니다.
 */
export function prepareEntityResponseType(
	responseClass: object,
	isSelectedRelation = false,
): boolean {
	const visitedResponseClasses = new Set<object>();
	let hasEntityResponse = false;

	const prepareResponseClass = (
		ResponseClass: object,
		isResponseRelation: boolean,
	): void => {
		if (
			typeof ResponseClass !== "function" ||
			visitedResponseClasses.has(ResponseClass)
		) {
			return;
		}
		visitedResponseClasses.add(ResponseClass);
		const responseMetadata = Reflect.getMetadata(
			ENTITY_RESPONSE_TYPE_METADATA,
			ResponseClass,
		) as EntityResponseMetadata | undefined;
		const swaggerPropertyKeys = (
			(Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES_ARRAY,
				ResponseClass.prototype,
			) ?? []) as string[]
		).map((propertyKey) => propertyKey.slice(1));

		if (responseMetadata || isResponseRelation) {
			// class-transformer는 클래스 수준 Exclude 전략을 상속하지 않습니다.
			Exclude()(ResponseClass);
			if (!responseMetadata) {
				for (const propertyKey of swaggerPropertyKeys) {
					Expose()(ResponseClass.prototype, propertyKey);
				}
			}
		}
		hasEntityResponse ||= Boolean(responseMetadata);

		const relationKeys = new Set([
			...swaggerPropertyKeys,
			...Object.keys(responseMetadata?.relations ?? {}),
		]);
		for (const propertyKey of relationKeys) {
			const getRelation = responseMetadata?.relations[propertyKey];
			let RelationClass: unknown;
			if (getRelation) {
				RelationClass = getRelation();
			} else {
				const swaggerOptions = Reflect.getMetadata(
					DECORATORS.API_MODEL_PROPERTIES,
					ResponseClass.prototype,
					propertyKey,
				) as ApiPropertyOptions | undefined;
				const swaggerType = swaggerOptions?.type;
				// Nest Swagger의 lazy type 관례에 맞춰 화살표 callback만 평가합니다.
				RelationClass =
					typeof swaggerType === "function" && !swaggerType.prototype
						? (swaggerType as () => unknown)()
						: swaggerType;
			}
			if (Array.isArray(RelationClass)) RelationClass = RelationClass[0];
			if (
				typeof RelationClass !== "function" ||
				[Object, Array, String, Number, Boolean, Date, BigInt].some(
					(PrimitiveClass) => PrimitiveClass === RelationClass,
				)
			) {
				continue;
			}
			prepareResponseClass(
				RelationClass as Type<object>,
				Boolean(responseMetadata) || Boolean(getRelation) || isResponseRelation,
			);
		}
	};

	prepareResponseClass(responseClass, isSelectedRelation);
	if (
		hasEntityResponse &&
		!isSelectedRelation &&
		!Reflect.hasMetadata(ENTITY_RESPONSE_TYPE_METADATA, responseClass)
	) {
		// 일반 wrapper도 Entity 응답을 포함하면 형제 필드까지 공개 API 선언으로 제한합니다.
		// 첫 탐색에서 graph를 확인한 뒤 적용하므로 Entity 없는 일반 DTO는 영향받지 않습니다.
		visitedResponseClasses.clear();
		prepareResponseClass(responseClass, true);
	}
	return hasEntityResponse;
}
