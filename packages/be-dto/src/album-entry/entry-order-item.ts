import { NumberField, ULIDField } from "@cocrepo/decorator";

/**
 * 엔트리 순서 항목
 */
export class EntryOrderItem {
	@ULIDField({ description: "엔트리 ID" })
	entryId!: string;

	@NumberField({ description: "새로운 위치", int: true })
	position!: number;
}
