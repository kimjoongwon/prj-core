import { ApiULIDProperty } from "@cocrepo/decorator";
import {
	BigIntIdFieldMetadata,
	DateFieldMetadata,
} from "@cocrepo/decorator/field";

/** Entity와 AggregateRoot가 공유하는 네 가지 기본 필드의 메타데이터입니다.
 * 내부 PK seq는 통신선에 노출하지 않고, id는 공개 ULID로만 노출합니다. */
export function AbstractEntityFields(): ClassDecorator {
	return (entityClass) => {
		ApiULIDProperty({ description: "공개 식별자 ULID" })(
			entityClass.prototype,
			"id",
		);
		BigIntIdFieldMetadata()(entityClass.prototype, "seq");
		DateFieldMetadata()(entityClass.prototype, "createdAt");
		DateFieldMetadata({ nullable: true })(entityClass.prototype, "updatedAt");
		DateFieldMetadata({ nullable: true })(entityClass.prototype, "removedAt");
	};
}
