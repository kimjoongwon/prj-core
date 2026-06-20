import { FolderAggregate } from "@cocrepo/aggregate";
import { CreateFolderDto, FolderQueryDto, UpdateFolderDto } from "@cocrepo/dto";
import { Folder } from "@cocrepo/entity";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FolderFacade {
	constructor(private readonly folderService: FolderAggregate) {}

	async getFolders(
		query: FolderQueryDto,
	): Promise<
		OffsetPaginatedResponse<
			Awaited<ReturnType<FolderAggregate["getFolders"]>>["data"]
		>
	> {
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

	createFolder(dto: CreateFolderDto, creatorId: string): Promise<Folder> {
		return this.folderService.createFolder(dto, creatorId);
	}

	updateFolder(folderId: string, dto: UpdateFolderDto): Promise<Folder> {
		return this.folderService.updateFolder(folderId, dto);
	}

	async deleteFolder(folderId: string): Promise<void> {
		await this.folderService.deleteFolder(folderId);
	}
}
