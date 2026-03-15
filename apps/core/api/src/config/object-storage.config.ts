import { ValidationUtil } from "@cocrepo/decorator";
import { registerAs } from "@nestjs/config";
import { IsBooleanString, IsIn, IsOptional, IsString } from "class-validator";
import type {
	ObjectStorageConfig,
	ObjectStorageProvider,
} from "./config.type";

class EnvironmentVariablesValidator {
	@IsString()
	@IsIn(["aws-s3", "backblaze-b2", "cloudflare-r2"])
	OBJECT_STORAGE_PROVIDER!: ObjectStorageProvider;

	@IsString()
	OBJECT_STORAGE_ACCESS_KEY!: string;

	@IsString()
	OBJECT_STORAGE_SECRET_KEY!: string;

	@IsOptional()
	@IsString()
	OBJECT_STORAGE_API_TOKEN?: string;

	@IsString()
	OBJECT_STORAGE_REGION!: string;

	@IsString()
	OBJECT_STORAGE_BUCKET!: string;

	@IsOptional()
	@IsString()
	OBJECT_STORAGE_ENDPOINT?: string;

	@IsOptional()
	@IsString()
	OBJECT_STORAGE_PUBLIC_BASE_URL?: string;

	@IsOptional()
	@IsBooleanString()
	OBJECT_STORAGE_FORCE_PATH_STYLE?: string;
}

function normalizePublicBaseUrl(publicBaseUrl?: string): string | undefined {
	return publicBaseUrl?.replace(/\/+$/, "");
}

export default registerAs<ObjectStorageConfig>("objectStorage", () => {
	ValidationUtil.validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		provider: process.env.OBJECT_STORAGE_PROVIDER! as ObjectStorageProvider,
		accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY!,
		secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY!,
		apiToken: process.env.OBJECT_STORAGE_API_TOKEN,
		region: process.env.OBJECT_STORAGE_REGION!,
		bucket: process.env.OBJECT_STORAGE_BUCKET!,
		endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
		publicBaseUrl: normalizePublicBaseUrl(
			process.env.OBJECT_STORAGE_PUBLIC_BASE_URL,
		),
		forcePathStyle: process.env.OBJECT_STORAGE_FORCE_PATH_STYLE === "true",
	};
});
