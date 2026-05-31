import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import type { ObjectStorageConfig } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { GetObjectResult } from "./get-object.result";
import { normalizeMetadataValue } from "./normalize-metadata-value";
import { ObjectStorageService } from "./object-storage.service";
import type { PutObjectInput } from "./put-object.input";
import type { PutObjectResult } from "./put-object.result";
import { resolveRegion } from "./resolve-region";

@Injectable()
export class S3CompatibleStorageService implements ObjectStorageService {
	private readonly logger = new Logger(S3CompatibleStorageService.name);
	private readonly client: S3Client;
	private readonly objectStorage: ObjectStorageConfig;

	constructor(private readonly configService: ConfigService) {
		const objectStorage =
			this.configService.get<ObjectStorageConfig>("objectStorage");
		if (!objectStorage) {
			throw new Error("Object storage configuration is missing");
		}

		this.objectStorage = objectStorage;
		const resolvedRegion = resolveRegion(objectStorage);
		if (resolvedRegion !== objectStorage.region) {
			this.logger.warn(
				`cloudflare-r2 region '${objectStorage.region}' is not supported, falling back to '${resolvedRegion}'`,
			);
		}
		this.client = new S3Client({
			region: resolvedRegion,
			endpoint: objectStorage.endpoint,
			forcePathStyle: objectStorage.forcePathStyle,
			credentials: {
				accessKeyId: objectStorage.accessKeyId,
				secretAccessKey: objectStorage.secretAccessKey,
			},
		});
	}

	async putObject(input: PutObjectInput): Promise<PutObjectResult> {
		this.logger.debug(
			`object 업로드: provider=${this.objectStorage.provider}, key=${input.key}`,
		);

		const result = await this.client.send(
			new PutObjectCommand({
				Bucket: this.objectStorage.bucket,
				Key: input.key,
				Body: input.body,
				ContentType: input.contentType,
				ContentLength: input.contentLength,
				Metadata: this.buildMetadata(input),
			}),
		);

		return {
			key: input.key,
			publicUrl: this.getPublicUrl(input.key),
			etag: result.ETag,
		};
	}

	async deleteObject(key: string): Promise<void> {
		this.logger.debug(
			`object 삭제: provider=${this.objectStorage.provider}, key=${key}`,
		);

		await this.client.send(
			new DeleteObjectCommand({
				Bucket: this.objectStorage.bucket,
				Key: key,
			}),
		);
	}

	async getObject(key: string): Promise<GetObjectResult> {
		this.logger.debug(
			`object 조회: provider=${this.objectStorage.provider}, key=${key}`,
		);

		const result = await this.client.send(
			new GetObjectCommand({
				Bucket: this.objectStorage.bucket,
				Key: key,
			}),
		);

		if (!result.Body) {
			throw new Error(`Object body is missing for key: ${key}`);
		}

		const byteArray = await result.Body.transformToByteArray();

		return {
			body: Buffer.from(byteArray),
			contentType: result.ContentType,
			contentLength: result.ContentLength,
			etag: result.ETag,
			lastModified: result.LastModified,
		};
	}

	getPublicUrl(key: string): string | null {
		if (!this.objectStorage.publicBaseUrl) {
			return null;
		}

		return `${this.objectStorage.publicBaseUrl}/${key}`;
	}

	private buildMetadata(
		input: PutObjectInput,
	): Record<string, string> | undefined {
		if (!input.metadata && !input.checksum) {
			return undefined;
		}

		const normalizedMetadata = input.metadata
			? Object.fromEntries(
					Object.entries(input.metadata).map(([key, value]) => [
						key,
						normalizeMetadataValue(value),
					]),
				)
			: undefined;

		return {
			...(normalizedMetadata ?? {}),
			...(input.checksum ? { checksumSha256: input.checksum } : {}),
		};
	}
}
