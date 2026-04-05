import { AssetQueryDto, MoveAssetDto, UploadAssetDto } from "@cocrepo/dto";
import { AssetService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AssetFacade {
  constructor(private readonly assetService: AssetService) {}

  async getAssets(query: AssetQueryDto): Promise<{
    data: Awaited<ReturnType<AssetService["getAssets"]>>["data"];
    meta: {
      total: number;
      skip: number;
      take: number;
      totalPages: number;
    };
  }> {
    const { data, totalCount } = await this.assetService.getAssets(query);
    const skip = query.skip ?? 0;
    const take = query.take ?? 20;

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
