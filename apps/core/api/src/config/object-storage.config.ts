import { ValidationUtil } from "@cocrepo/decorator";
import { registerAs } from "@nestjs/config";
import { IsBooleanString, IsIn, IsOptional, IsString } from "class-validator";
import type { ObjectStorageConfig, ObjectStorageProvider } from "./config.type";

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

function normalizeOptionalString(value?: string): string | undefined {
	const normalizedValue = value?.trim();
	return normalizedValue ? normalizedValue : undefined;
}

function normalizeOptionalBooleanString(value?: string): string | undefined {
	return normalizeOptionalString(value);
}

function normalizeEndpoint(
	endpoint: string | undefined,
	bucket: string,
): string | undefined {
	const normalizedEndpoint = normalizeOptionalString(endpoint);
	if (!normalizedEndpoint) {
		return undefined;
	}

	const parsedEndpoint = new URL(normalizedEndpoint);
	if (parsedEndpoint.search || parsedEndpoint.hash) {
		throw new Error(
			"OBJECT_STORAGE_ENDPOINT must not include query or hash parameters.",
		);
	}

	const normalizedPathname = parsedEndpoint.pathname.replace(/\/+$/, "");
	if (!normalizedPathname) {
		return parsedEndpoint.origin;
	}

	if (normalizedPathname === `/${bucket}`) {
		return parsedEndpoint.origin;
	}

	throw new Error(
		"OBJECT_STORAGE_ENDPOINT must be origin-only. Configure the bucket with OBJECT_STORAGE_BUCKET instead of including it in the endpoint path.",
	);
}

function normalizePublicBaseUrl(publicBaseUrl?: string): string | undefined {
	const normalizedValue = normalizeOptionalString(publicBaseUrl);
	return normalizedValue?.replace(/\/+$/, "");
}

function resolveForcePathStyle(
	provider: ObjectStorageProvider,
	forcePathStyle: string | undefined,
): boolean {
	if (forcePathStyle !== undefined) {
		return forcePathStyle === "true";
	}

	return provider === "backblaze-b2";
}

export default registerAs<ObjectStorageConfig>("objectStorage", () => {
	const provider = process.env
		.OBJECT_STORAGE_PROVIDER! as ObjectStorageProvider;
	const bucket = process.env.OBJECT_STORAGE_BUCKET!;
	const forcePathStyle = normalizeOptionalBooleanString(
		process.env.OBJECT_STORAGE_FORCE_PATH_STYLE,
	);
	const endpoint = normalizeEndpoint(
		process.env.OBJECT_STORAGE_ENDPOINT,
		bucket,
	);
	const publicBaseUrl = normalizePublicBaseUrl(
		process.env.OBJECT_STORAGE_PUBLIC_BASE_URL,
	);
	const apiToken = normalizeOptionalString(
		process.env.OBJECT_STORAGE_API_TOKEN,
	);

	ValidationUtil.validateConfig(
		{
			...process.env,
			OBJECT_STORAGE_API_TOKEN: apiToken,
			OBJECT_STORAGE_ENDPOINT: endpoint,
			OBJECT_STORAGE_PUBLIC_BASE_URL: publicBaseUrl,
			OBJECT_STORAGE_FORCE_PATH_STYLE: forcePathStyle,
		},
		EnvironmentVariablesValidator,
	);

	return {
		provider,
		accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY!,
		secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY!,
		apiToken,
		region: process.env.OBJECT_STORAGE_REGION!,
		bucket,
		endpoint,
		publicBaseUrl,
		forcePathStyle: resolveForcePathStyle(provider, forcePathStyle),
	};
});
