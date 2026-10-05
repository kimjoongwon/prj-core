import { Transform } from "class-transformer";

import { EntryOrderItem } from "../entry-order-item";

/**
 * 앨범 엔트리 순서 변경 DTO
 */
export class ReorderAlbumEntriesDto {
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	entries!: EntryOrderItem[];
}
