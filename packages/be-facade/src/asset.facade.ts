import { AssetAggregate } from "@cocrepo/aggregate";
import { AssetQueryDto, MoveAssetDto, UploadAssetDto } from "@cocrepo/dto";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AssetFacade {
	constructor(private readonly assetService: AssetAggregate) {}

	async getAssets(
		query: AssetQueryDto,
	): Promise<
		OffsetPaginatedResponse<
			Awaited<ReturnType<AssetAggregate["getAssets"]>>["data"]
		>
	> {
		const assetResult = await this.assetService.getAssets(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return buildOffsetPaginatedResponse(
			assetResult.data,
			assetResult.totalCount,
			skip,
			take,
		);
	}

	getAssetById(assetId: string) {
		return this.assetService.getAssetById(assetId);
	}

	getAssetContent(assetId: string) {
		return this.assetService.getAssetContent(assetId);
	}

	moveAsset(assetId: string, dto: MoveAssetDto) {
		return this.assetService.moveAsset(assetId, dto);
	}

	uploadAsset(
		dto: UploadAssetDto,
		file: Express.Multer.File | undefined,
		creatorId: string,
	) {
		return this.assetService.uploadAsset(dto, file, creatorId);
	}

	async deleteAsset(assetId: string): Promise<void> {
		await this.assetService.deleteAsset(assetId);
	}
}
