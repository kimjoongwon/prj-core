import { createHash, randomUUID } from "node:crypto";
import { extname } from "node:path";
import { SpaceContext } from "@cocrepo/context";
import { Asset } from "@cocrepo/entity";
import type {
	GetAssetsQueryInput,
	MoveAssetCommandInput,
	UploadAssetCommandInput,
} from "@cocrepo/input";
import { AssetKind, AssetStatus, type Prisma } from "@cocrepo/prisma";
import {
	AssetsRepository,
	buildAssetQueryOrderBy,
	buildAssetQueryWhere,
	FoldersRepository,
} from "@cocrepo/repository";
import { ObjectStorageService } from "@cocrepo/service";
import { Checksum, FileSize, StorageKey } from "@cocrepo/vo";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { normalizeUploadedFileName } from "./normalize-uploaded-file-name";
import type { UploadedAssetFile } from "./uploaded-asset-file";

@Injectable()
export class AssetAggregate {
	private readonly logger = new Logger(AssetAggregate.name);

	constructor(
		private readonly assetsRepository: AssetsRepository,
		private readonly foldersRepository: FoldersRepository,
		private readonly objectStorageService: ObjectStorageService,
		private readonly spaceContext: SpaceContext,
	) {}

	async getAssets(query: GetAssetsQueryInput) {
		const spaceId = this.getCurrentSpaceId();
		this.logger.debug(`에셋 목록 조회: space=${spaceId.slice(-8)}`);
		const spaceIds = this.spaceContext.spaceIds;
		const where = this.applySpaceScope(
			buildAssetQueryWhere(
				query,
				spaceIds === undefined ? undefined : { spaceId: { in: spaceIds } },
			),
			spaceIds,
		);

		const assetResult = await this.assetsRepository.findMany({
			where,
			orderBy: buildAssetQueryOrderBy(query),
			skip: query.skip,
			take: query.take,
		});

		return {
			data: assetResult.assets.map((asset) => this.serializeAsset(asset)),
			totalCount: assetResult.totalCount,
		};
	}

	async getAssetById(assetId: string) {
		const asset = await this.getCurrentSpaceAsset(assetId);
		return this.serializeAsset(asset);
	}

	async getAssetContent(assetId: string) {
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

	async moveAsset(assetId: string, dto: MoveAssetCommandInput) {
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
		dto: UploadAssetCommandInput,
		file: UploadedAssetFile | undefined,
		createdById: string,
	) {
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
		const checksum = Checksum.sha256(
			createHash("sha256").update(file.buffer).digest("hex"),
		);
		const fileSize = FileSize.fromBytes(file.size);

		await this.objectStorageService.putObject({
			key: storageKey.value,
			body: file.buffer,
			contentType: file.mimetype,
			contentLength: Number(fileSize.bytes),
			checksum: checksum.value,
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
			storageKey: storageKey.value,
			mimeType: file.mimetype,
			sizeBytes: fileSize.bytes,
			extension,
			checksum: checksum.value,
			metadata: null,
			createdById,
		});

		return this.serializeAsset(asset);
	}

	private getCurrentSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;

		if (!spaceId) {
			throw new BadRequestException(
				"x-tenant-id 헤더가 필요합니다. Space를 선택해주세요.",
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

	private serializeAsset(asset: Asset) {
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
	): StorageKey {
		const normalizedExtension = extension ? `.${extension}` : "";
		return StorageKey.fromPath(
			`spaces/${spaceId}/assets/${kind.toLowerCase()}/${randomUUID()}${normalizedExtension}`,
		);
	}
}
