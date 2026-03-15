import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import type { ObjectStorageConfig } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const CLOUDFLARE_R2_REGIONS = new Set([
	"auto",
	"wnam",
	"enam",
	"weur",
	"eeur",
	"apac",
	"oc",
]);

export interface PutObjectInput {
	key: string;
	body: Buffer | Uint8Array | string;
	contentType: string;
	contentLength?: number;
	checksum?: string;
	metadata?: Record<string, string>;
}

export interface PutObjectResult {
	key: string;
	publicUrl: string | null;
	etag?: string;
}

export abstract class ObjectStorageService {
	abstract putObject(input: PutObjectInput): Promise<PutObjectResult>;
	abstract deleteObject(key: string): Promise<void>;
	abstract getPublicUrl(key: string): string | null;
}

function resolveRegion(objectStorage: ObjectStorageConfig): string {
	if (objectStorage.provider !== "cloudflare-r2") {
		return objectStorage.region;
	}

	if (CLOUDFLARE_R2_REGIONS.has(objectStorage.region)) {
		return objectStorage.region;
	}

	return "auto";
}

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

	getPublicUrl(key: string): string | null {
		if (!this.objectStorage.publicBaseUrl) {
			return null;
		}

		return `${this.objectStorage.publicBaseUrl}/${key}`;
	}

	private buildMetadata(input: PutObjectInput): Record<string, string> | undefined {
		if (!input.metadata && !input.checksum) {
			return undefined;
		}

		return {
			...(input.metadata ?? {}),
			...(input.checksum ? { checksumSha256: input.checksum } : {}),
		};
	}
}
