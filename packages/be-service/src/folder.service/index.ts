import { FolderQueryDto } from "@cocrepo/dto";
import { Folder } from "@cocrepo/entity";
import { SpaceContext } from "@cocrepo/context";
import { FoldersRepository } from "@cocrepo/repository";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class FolderService {
	private readonly logger = new Logger(FolderService.name);

	constructor(
		private readonly foldersRepository: FoldersRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async getFolders(
		query: FolderQueryDto,
	): Promise<{ data: Folder[]; totalCount: number }> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new BadRequestException(
				"X-Space-ID 헤더가 필요합니다. Space를 선택해주세요.",
			);
		}

		this.logger.debug(`폴더 목록 조회: space=${spaceId.slice(-8)}`);

		const { folders, totalCount } = await this.foldersRepository.findMany({
			where: query.toPrismaWhere({ spaceId }),
			orderBy: query.sort?.length ? query.toPrismaOrderBy() : undefined,
			skip: query.skip,
			take: query.take,
		});

		return {
			data: folders,
			totalCount,
		};
	}
}
