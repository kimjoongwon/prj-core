import { FolderAggregate } from "@cocrepo/aggregate";
import { GetFoldersQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetFoldersQuery)
export class GetFoldersUseCase {
	constructor(private readonly folderService: FolderAggregate) {}

	async execute(query: GetFoldersQuery): Promise<unknown> {
		const folderResult = await this.folderService.getFolders(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? folderResult.data.length;
		return buildOffsetPaginatedResponse(
			folderResult.data,
			folderResult.totalCount,
			skip,
			take,
		);
	}
}
