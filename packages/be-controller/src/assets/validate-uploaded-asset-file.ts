import { open, stat } from "node:fs/promises";
import { BadRequestException } from "@nestjs/common";
import {
	ASSET_UPLOAD_LIMITS,
	type AssetUploadMimeType,
	isAssetUploadTemporaryFilePath,
	isAllowedAssetUploadMimeType,
} from "./asset-upload.options";

const PNG_FILE_SIGNATURE = Buffer.from([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const JPEG_FILE_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const GIF87A_FILE_SIGNATURE = Buffer.from("GIF87a", "ascii");
const GIF89A_FILE_SIGNATURE = Buffer.from("GIF89a", "ascii");
const PDF_FILE_SIGNATURE = Buffer.from("%PDF-", "ascii");
const RIFF_FILE_SIGNATURE = Buffer.from("RIFF", "ascii");
const WEBP_FILE_SIGNATURE = Buffer.from("WEBP", "ascii");
const MP4_FILE_TYPE_BOX = Buffer.from("ftyp", "ascii");

const bufferStartsWithSignature = (buffer: Buffer, signature: Buffer) =>
	buffer.length >= signature.length && buffer.subarray(0, signature.length).equals(signature);

const detectUploadedAssetMimeType = (
	fileBuffer: Buffer,
): AssetUploadMimeType | undefined => {
	if (bufferStartsWithSignature(fileBuffer, PNG_FILE_SIGNATURE)) {
		return "image/png";
	}

	if (bufferStartsWithSignature(fileBuffer, JPEG_FILE_SIGNATURE)) {
		return "image/jpeg";
	}

	if (
		bufferStartsWithSignature(fileBuffer, GIF87A_FILE_SIGNATURE) ||
		bufferStartsWithSignature(fileBuffer, GIF89A_FILE_SIGNATURE)
	) {
		return "image/gif";
	}

	if (
		bufferStartsWithSignature(fileBuffer, RIFF_FILE_SIGNATURE) &&
		fileBuffer.length >= 12 &&
		fileBuffer.subarray(8, 12).equals(WEBP_FILE_SIGNATURE)
	) {
		return "image/webp";
	}

	if (bufferStartsWithSignature(fileBuffer, PDF_FILE_SIGNATURE)) {
		return "application/pdf";
	}

	if (
		fileBuffer.length >= 12 &&
		fileBuffer.subarray(4, 8).equals(MP4_FILE_TYPE_BOX)
	) {
		return "video/mp4";
	}
};

export async function validateUploadedAssetFile(
	file: Express.Multer.File | undefined,
): Promise<void> {
	if (!file) {
		throw new BadRequestException("업로드할 파일이 필요합니다.");
	}

	if (!isAllowedAssetUploadMimeType(file.mimetype)) {
		throw new BadRequestException("허용되지 않은 파일 MIME 타입입니다.");
	}

	if (!file.path || !isAssetUploadTemporaryFilePath(file.path)) {
		throw new BadRequestException("업로드 임시 파일 경로가 올바르지 않습니다.");
	}

	let fileHandle: Awaited<ReturnType<typeof open>> | undefined;
	let fileBuffer: Buffer;
	let actualFileSize: number;
	try {
		const fileStats = await stat(file.path);
		if (!fileStats.isFile()) {
			throw new Error("업로드 임시 파일이 일반 파일이 아닙니다.");
		}

		fileHandle = await open(file.path, "r");
		const inspectedFileBytes = Buffer.alloc(12);
		const { bytesRead } = await fileHandle.read(inspectedFileBytes, 0, 12, 0);
		fileBuffer = inspectedFileBytes.subarray(0, bytesRead);
		actualFileSize = fileStats.size;
	} catch {
		throw new BadRequestException("업로드 임시 파일을 검증할 수 없습니다.");
	} finally {
		await fileHandle?.close();
	}

	if (
		file.size > ASSET_UPLOAD_LIMITS.fileSize ||
		actualFileSize > ASSET_UPLOAD_LIMITS.fileSize
	) {
		throw new BadRequestException("업로드 파일 크기가 허용 한도를 초과했습니다.");
	}

	const detectedMimeType = detectUploadedAssetMimeType(fileBuffer);
	if (!detectedMimeType || detectedMimeType !== file.mimetype) {
		throw new BadRequestException(
			"파일 내용이 요청 MIME 타입과 일치하지 않습니다.",
		);
	}
}
