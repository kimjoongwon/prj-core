import { createHash, randomUUID } from "node:crypto";
import { extname } from "node:path";
import { SpaceContext } from "@cocrepo/context";
import { AssetQueryDto, MoveAssetDto, UploadAssetDto } from "@cocrepo/dto";
import { Asset } from "@cocrepo/entity";
import { AssetKind, AssetStatus, type Prisma } from "@cocrepo/prisma";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { ObjectStorageService } from "./object-storage.service";

type AssetPayload = Record<string, unknown>;
type AssetContentPayload = {
	body: Buffer;
	contentType: string;
	contentLength?: number;
	etag?: string;
	fileName: string;
	lastModified?: Date;
};
type UploadedAssetFile = {
	originalname: string;
	mimetype: string;
	size: number;
	buffer: Buffer;
};

function normalizeUploadedFileName(fileName: string): string {
	if (isAscii(fileName)) {
		return fileName;
	}

	const decodedName = Buffer.from(fileName, "latin1").toString("utf8");
	const hasReplacementCharacter = decodedName.includes("\uFFFD");
	const roundTrippedName = Buffer.from(decodedName, "utf8").toString("latin1");

	return !hasReplacementCharacter && roundTrippedName === fileName
		? decodedName
		: fileName;
}

function isAscii(value: string): boolean {
	for (let index = 0; index < value.length; index += 1) {
		if (value.charCodeAt(index) > 0x7f) {
			return false;
		}
	}

	return true;
}

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
		const spaceIds = this.spaceContext.spaceIds;
		const where = this.applySpaceScope(
			query.toPrismaWhere(
				spaceIds === undefined ? undefined : { spaceId: { in: spaceIds } },
			),
			spaceIds,
		);

		const { assets, totalCount } = await this.assetsRepository.findMany({
			where,
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

	async getAssetContent(assetId: string): Promise<AssetContentPayload> {
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

		if (
			this.spaceContext.spaceIds !== undefined &&
			asset.spaceId !== this.getCurrentSpaceId()
		) {
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

		const normalizedOriginalName = normalizeUploadedFileName(file.originalname);
		const spaceId = this.getCurrentSpaceId();
		const targetFolder = await this.foldersRepository.findById(dto.folderId);

		if (
			!targetFolder ||
			targetFolder.removedAt ||
			targetFolder.spaceId !== spaceId
		) {
			throw new NotFoundException("업로드할 폴더를 찾을 수 없습니다");
		}

		const extension = this.extractExtension(normalizedOriginalName);
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
				originalName: normalizedOriginalName,
			},
		});

		const asset = await this.assetsRepository.create({
			spaceId,
			folderId: dto.folderId,
			kind,
			status: AssetStatus.READY,
			originalName: normalizedOriginalName,
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
				"x-space-id 헤더가 필요합니다. Space를 선택해주세요.",
			);
		}

		return spaceId;
	}

	private async getCurrentSpaceAsset(assetId: string): Promise<Asset> {
		const asset = await this.assetsRepository.findByIdWithRelations(assetId);
		this.getCurrentSpaceId();

		if (!asset || asset.removedAt || !this.canReadSpace(asset.spaceId)) {
			throw new NotFoundException("에셋을 찾을 수 없습니다");
		}

		return asset;
	}

	private applySpaceScope(
		where: Prisma.AssetWhereInput,
		spaceIds?: string[],
	): Prisma.AssetWhereInput {
		if (spaceIds === undefined) {
			return where;
		}

		return {
			...where,
			spaceId: { in: spaceIds },
		};
	}

	private canReadSpace(spaceId: string): boolean {
		const spaceIds = this.spaceContext.spaceIds;
		return spaceIds === undefined || spaceIds.includes(spaceId);
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
