import { getMetadataStorage, IsOptional } from "class-validator";

/** 생성자나 기본값을 복사하지 않는 검증 전용 Schema 생성자입니다. */
export type SchemaConstructor<T extends object> = new () => T;

/** 선택한 필드의 검증 메타데이터만 재사용합니다. 원본 Schema의 메서드와 초기값은 상속하지 않습니다. */
export function PickSchemaType<T extends object, K extends keyof T>(
	schema: SchemaConstructor<T>,
	keys: readonly K[],
): SchemaConstructor<Pick<T, K>> {
	class PickedSchema {}
	const selectedKeys = new Set<PropertyKey>(keys);
	const storage = getMetadataStorage();
	const rules = storage.getTargetValidationMetadatas(schema, "", false, false);
	for (const rule of rules) {
		if (selectedKeys.has(rule.propertyName))
			storage.addValidationMetadata({ ...rule, target: PickedSchema });
	}
	return PickedSchema as SchemaConstructor<Pick<T, K>>;
}

/** Nest PartialType의 기본 계약처럼 undefined와 null을 선택 입력으로 취급합니다. */
export function PartialSchemaType<T extends object>(
	schema: SchemaConstructor<T>,
): SchemaConstructor<Partial<T>> {
	const storage = getMetadataStorage();
	const keys = [
		...new Set(
			storage
				.getTargetValidationMetadatas(schema, "", false, false)
				.map((rule) => rule.propertyName),
		),
	];
	const PartialSchema = PickSchemaType(schema, keys as (keyof T)[]);
	for (const key of keys) IsOptional()(PartialSchema.prototype, key);
	return PartialSchema;
}
