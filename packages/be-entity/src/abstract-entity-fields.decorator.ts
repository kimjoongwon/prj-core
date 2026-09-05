import { BigIntIdField, DateField } from "@cocrepo/decorator/field";

/** Entity와 AggregateRoot가 공유하는 네 가지 기본 필드의 메타데이터입니다. */
export function AbstractEntityFields(): ClassDecorator {
	return (entityClass) => {
		BigIntIdField()(entityClass.prototype, "id");
		DateField()(entityClass.prototype, "createdAt");
		DateField({ nullable: true })(entityClass.prototype, "updatedAt");
		DateField({ nullable: true })(entityClass.prototype, "removedAt");
	};
}
