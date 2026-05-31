import { NumberField, UUIDField } from "@cocrepo/decorator";

/**
 * 엔트리 순서 항목
 */
export class EntryOrderItem {
	@UUIDField({ description: "엔트리 ID" })
	entryId!: string;

	@NumberField({ description: "새로운 위치", int: true })
	position!: number;
}
