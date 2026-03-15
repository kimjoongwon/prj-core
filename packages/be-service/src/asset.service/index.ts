import { AssetQueryDto, MoveAssetDto } from "@cocrepo/dto";
import { Asset } from "@cocrepo/entity";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import { SpaceContext } from "@cocrepo/context";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

type AssetPayload = Record<string, unknown>;

@Injectable()
export class AssetService {
	private readonly logger = new Logger(AssetService.name);

	constructor(
		private readonly assetsRepository: AssetsRepository,
		private readonly foldersRepository: FoldersRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async getAssets(
		query: AssetQueryDto,
	): Promise<{ data: AssetPayload[]; totalCount: number }> {
		const spaceId = this.getCurrentSpaceId();
		this.logger.debug(`에셋 목록 조회: space=${spaceId.slice(-8)}`);

		const { assets, totalCount } = await this.assetsRepository.findMany({
			where: query.toPrismaWhere({ spaceId }),
			orderBy: query.sort?.length ? query.toPrismaOrderBy() : undefined,
			skip: query.skip,
			take: query.take,
		});

		return {
			data: assets.map((asset) => this.serializeAsset(asset)),
			totalCount,
		};
	}

	async getAssetById(assetId: string): Promise<AssetPayload> {
		const asset = await this.getCurrentSpaceAsset(assetId);
		return this.serializeAsset(asset);
	}

	async moveAsset(assetId: string, dto: MoveAssetDto): Promise<AssetPayload> {
		const currentSpaceId = this.getCurrentSpaceId();
		const asset = await this.getCurrentSpaceAsset(assetId);
		const targetFolder = await this.foldersRepository.findById(dto.targetFolderId);

		if (
			!targetFolder ||
			targetFolder.removedAt ||
			targetFolder.spaceId !== currentSpaceId
		) {
			throw new NotFoundException("이동할 폴더를 찾을 수 없습니다");
		}

		if (asset.folderId === dto.targetFolderId) {
			throw new BadRequestException("이미 선택한 폴더에 속한 에셋입니다");
		}

		const movedAsset = await this.assetsRepository.updateById(assetId, {
			folderId: dto.targetFolderId,
		});

		return this.serializeAsset(movedAsset);
	}

	async deleteAsset(assetId: string): Promise<void> {
		const asset = await this.getCurrentSpaceAsset(assetId);

		if (asset.spaceId !== this.getCurrentSpaceId()) {
			throw new ForbiddenException("현재 Space의 에셋만 삭제할 수 있습니다");
		}

		await this.assetsRepository.deleteById(assetId);
	}

	private getCurrentSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;

		if (!spaceId) {
			throw new BadRequestException(
				"X-Space-ID 헤더가 필요합니다. Space를 선택해주세요.",
			);
		}

		return spaceId;
	}

	private async getCurrentSpaceAsset(assetId: string): Promise<Asset> {
		const asset = await this.assetsRepository.findByIdWithRelations(assetId);
		const currentSpaceId = this.getCurrentSpaceId();

		if (!asset || asset.removedAt || asset.spaceId !== currentSpaceId) {
			throw new NotFoundException("에셋을 찾을 수 없습니다");
		}

		return asset;
	}

	private serializeAsset(asset: Asset): AssetPayload {
		return {
			...asset,
			sizeBytes: Number(asset.sizeBytes),
		};
	}
}
