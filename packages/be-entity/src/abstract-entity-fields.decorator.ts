import {
	BigIntIdFieldMetadata,
	DateFieldMetadata,
} from "@cocrepo/decorator/field";

/** Entity와 AggregateRoot가 공유하는 네 가지 기본 필드의 메타데이터입니다. */
export function AbstractEntityFields(): ClassDecorator {
	return (entityClass) => {
		BigIntIdFieldMetadata()(entityClass.prototype, "id");
		DateFieldMetadata()(entityClass.prototype, "createdAt");
		DateFieldMetadata({ nullable: true })(
			entityClass.prototype,
			"updatedAt",
		);
		DateFieldMetadata({ nullable: true })(
			entityClass.prototype,
			"removedAt",
		);
	};
}
