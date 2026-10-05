import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, resolve, sep } from "node:path";
import { BadRequestException } from "@nestjs/common";
import type { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";

const MEBIBYTE = 1024 * 1024;

export const ASSET_UPLOAD_TEMPORARY_DIRECTORY = join(
	tmpdir(),
	"cocrepo-asset-uploads",
);

export const ASSET_UPLOAD_MIME_TYPES = [
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
	"application/pdf",
	"video/mp4",
] as const;

export type AssetUploadMimeType = (typeof ASSET_UPLOAD_MIME_TYPES)[number];

export const ASSET_UPLOAD_LIMITS = {
	fileSize: 25 * MEBIBYTE,
	files: 1,
	fields: 1,
	parts: 3,
	fieldNameSize: 32,
	fieldSize: 64,
	headerPairs: 16,
	fieldNestingDepth: 0,
	fieldArrayIndexLimit: 0,
} as const;

export const isAllowedAssetUploadMimeType = (
	mimeType: string,
): mimeType is AssetUploadMimeType =>
	ASSET_UPLOAD_MIME_TYPES.includes(mimeType as AssetUploadMimeType);

export const isAssetUploadTemporaryFilePath = (filePath: string): boolean => {
	const temporaryDirectoryPath = resolve(ASSET_UPLOAD_TEMPORARY_DIRECTORY);
	const temporaryFilePath = resolve(filePath);
	const filePathRelativeToTemporaryDirectory = relative(
		temporaryDirectoryPath,
		temporaryFilePath,
	);

	return (
		filePathRelativeToTemporaryDirectory.length > 0 &&
		!filePathRelativeToTemporaryDirectory.startsWith(`..${sep}`) &&
		filePathRelativeToTemporaryDirectory !== ".." &&
		!filePathRelativeToTemporaryDirectory.startsWith(sep)
	);
};

export const ASSET_UPLOAD_OPTIONS: MulterOptions = {
	storage: diskStorage({
		destination: (_request, _file, callback) => {
			mkdir(ASSET_UPLOAD_TEMPORARY_DIRECTORY, {
				recursive: true,
				mode: 0o700,
			})
				.then(() => callback(null, ASSET_UPLOAD_TEMPORARY_DIRECTORY))
				.catch((error: unknown) => callback(error as Error, ""));
		},
		filename: (_request, _file, callback) => callback(null, randomUUID()),
	}),
	limits: ASSET_UPLOAD_LIMITS,
	fileFilter: (_request, file, callback) => {
		if (!isAllowedAssetUploadMimeType(file.mimetype)) {
			callback(
				new BadRequestException("허용되지 않은 파일 MIME 타입입니다."),
				false,
			);
			return;
		}

		callback(null, true);
	},
};
