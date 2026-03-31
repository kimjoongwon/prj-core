import { AssetQueryDto, MoveAssetDto, UploadAssetDto } from "@cocrepo/dto";
import { Asset } from "@cocrepo/entity";
import { AssetKind, AssetStatus } from "@cocrepo/prisma";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import { SpaceContext } from "@cocrepo/context";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { createHash, randomUUID } from "crypto";
import { extname } from "path";
import { ObjectStorageService } from "../object-storage.service";

type AssetPayload = Record<string, unknown>;
type UploadedAssetFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(
    private readonly assetsRepository: AssetsRepository,
    private readonly foldersRepository: FoldersRepository,
    private readonly objectStorageService: ObjectStorageService,
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
    const targetFolder = await this.foldersRepository.findById(
      dto.targetFolderId,
    );

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

    await this.objectStorageService.deleteObject(asset.storageKey);
    await this.assetsRepository.deleteById(assetId);
  }

  async uploadAsset(
    dto: UploadAssetDto,
    file: UploadedAssetFile | undefined,
    creatorId: string,
  ): Promise<AssetPayload> {
    if (!file) {
      throw new BadRequestException("업로드할 파일이 필요합니다");
    }

    const spaceId = this.getCurrentSpaceId();
    const targetFolder = await this.foldersRepository.findById(dto.folderId);

    if (
      !targetFolder ||
      targetFolder.removedAt ||
      targetFolder.spaceId !== spaceId
    ) {
      throw new NotFoundException("업로드할 폴더를 찾을 수 없습니다");
    }

    const extension = this.extractExtension(file.originalname);
    const kind = this.resolveAssetKind(file.mimetype);
    const storageKey = this.buildStorageKey(spaceId, kind, extension);
    const checksum = createHash("sha256").update(file.buffer).digest("hex");

    await this.objectStorageService.putObject({
      key: storageKey,
      body: file.buffer,
      contentType: file.mimetype,
      contentLength: file.size,
      checksum,
      metadata: {
        originalName: file.originalname,
      },
    });

    const asset = await this.assetsRepository.create({
      spaceId,
      folderId: dto.folderId,
      kind,
      status: AssetStatus.READY,
      originalName: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      sizeBytes: BigInt(file.size),
      extension,
      checksum,
      metadata: null,
      creatorId,
    });

    return this.serializeAsset(asset);
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
      publicUrl: this.objectStorageService.getPublicUrl(asset.storageKey),
    };
  }

  private resolveAssetKind(mimeType: string): AssetKind {
    if (mimeType.startsWith("image/")) {
      return AssetKind.IMAGE;
    }

    if (mimeType.startsWith("video/")) {
      return AssetKind.VIDEO;
    }

    return AssetKind.DOCUMENT;
  }

  private extractExtension(fileName: string): string | null {
    const extension = extname(fileName).replace(/^\./, "").toLowerCase();
    return extension || null;
  }

  private buildStorageKey(
    spaceId: string,
    kind: AssetKind,
    extension: string | null,
  ): string {
    const normalizedExtension = extension ? `.${extension}` : "";
    return `spaces/${spaceId}/assets/${kind.toLowerCase()}/${randomUUID()}${normalizedExtension}`;
  }
}
