import type { FolderQueryDto } from "@cocrepo/dto";

export class GetFoldersQuery {
	constructor(readonly query: FolderQueryDto) {}
}
