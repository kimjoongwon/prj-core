import { BigIntIdField, NumberField } from "@cocrepo/decorator/field";

/**
 * 엔트리 순서 항목
 */
export class EntryOrderItem {
	@BigIntIdField({ description: "엔트리 ID" })
	entryId!: bigint;

	@NumberField({ description: "새로운 위치", int: true })
	position!: number;
}
