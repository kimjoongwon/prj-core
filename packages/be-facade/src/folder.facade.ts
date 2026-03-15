import { CreateFolderDto, FolderQueryDto, UpdateFolderDto } from "@cocrepo/dto";
import { Folder } from "@cocrepo/entity";
import { FolderService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FolderFacade {
  constructor(private readonly folderService: FolderService) {}

  async getFolders(query: FolderQueryDto): Promise<{
    data: Awaited<ReturnType<FolderService["getFolders"]>>["data"];
    meta: {
      total: number;
      skip: number;
      take: number;
      totalPages: number;
    };
  }> {
    const { data, totalCount } = await this.folderService.getFolders(query);
    const skip = query.skip ?? 0;
    const take = query.take ?? data.length;

    return {
      data,
      meta: {
        total: totalCount,
        skip,
        take,
        totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
      },
    };
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
