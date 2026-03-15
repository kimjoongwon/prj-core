import { FolderQueryDto } from "@cocrepo/dto";
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
}
