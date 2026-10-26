import { SpaceContext } from "@cocrepo/context";
import { Asset } from "@cocrepo/entity";
import { AssetsRepository } from "@cocrepo/repository";
import { ObjectStorageService } from "@cocrepo/service";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class AssetAggregate {
	constructor(
		private readonly assetsRepository: AssetsRepository,
		private readonly objectStorageService: ObjectStorageService,
		private readonly spaceContext: SpaceContext,
	) {}

	async getAssetContent(assetId: bigint) {
		const asset = await this.getCurrentSpaceAsset(assetId);
		const object = await this.objectStorageService.getObject(asset.storageKey);

		return {
			body: object.body,
			contentType: object.contentType ?? asset.mimeType,
			contentLength: object.contentLength,
			etag: object.etag,
			fileName: asset.originalName,
			lastModified: object.lastModified,
		};
	}

	private getCurrentSpaceId(): bigint {
		const spaceId = this.spaceContext.spaceId;

		if (!spaceId) {
			throw new BadRequestException(
				"x-tenant-id 헤더가 필요합니다. Space를 선택해주세요.",
			);
		}

		return spaceId;
	}

	private async getCurrentSpaceAsset(assetId: bigint): Promise<Asset> {
		const asset = await this.assetsRepository.findByIdWithRelations(assetId);
		this.getCurrentSpaceId();

		if (!asset || asset.removedAt || !this.canReadSpace(asset.space?.id)) {
			throw new NotFoundException("에셋을 찾을 수 없습니다");
		}

		return asset;
	}

	private canReadSpace(spaceId?: bigint | null): boolean {
		const spaceIds = this.spaceContext.spaceIds;
		return (
			spaceIds === undefined || (spaceId != null && spaceIds.includes(spaceId))
		);
	}
}
