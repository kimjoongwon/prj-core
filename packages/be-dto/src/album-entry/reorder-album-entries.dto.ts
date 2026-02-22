import { Transform } from "class-transformer";
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

/**
 * 앨범 엔트리 순서 변경 DTO
 */
export class ReorderAlbumEntriesDto {
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	entries!: EntryOrderItem[];
}
