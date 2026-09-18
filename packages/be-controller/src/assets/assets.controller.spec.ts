import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { AuthContext } from "@cocrepo/context";
import { UploadAssetDto } from "@cocrepo/dto";
import {
	BadRequestException,
	type NestInterceptor,
	type Type,
} from "@nestjs/common";
import { INTERCEPTORS_METADATA } from "@nestjs/common/constants";
import type { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
	ASSET_UPLOAD_LIMITS,
	ASSET_UPLOAD_OPTIONS,
	ASSET_UPLOAD_TEMPORARY_DIRECTORY,
} from "./asset-upload.options";
import { AssetsController } from "./assets.controller";
import { validateUploadedAssetFile } from "./validate-uploaded-asset-file";

type AssetUploadInterceptor = NestInterceptor & {
	multer: {
		limits: typeof ASSET_UPLOAD_LIMITS;
		storage: unknown;
	};
};

const createdTemporaryAssetFilePaths: string[] = [];

const createTemporaryAssetUploadFile = async (
	mimeType: string,
	fileContent: Buffer,
	declaredSize = fileContent.length,
): Promise<Express.Multer.File> => {
	await mkdir(ASSET_UPLOAD_TEMPORARY_DIRECTORY, {
		recursive: true,
		mode: 0o700,
	});

	const temporaryFilePath = join(
		ASSET_UPLOAD_TEMPORARY_DIRECTORY,
		randomUUID(),
	);
	await writeFile(temporaryFilePath, fileContent);
	createdTemporaryAssetFilePaths.push(temporaryFilePath);

	return {
		mimetype: mimeType,
		size: declaredSize,
		path: temporaryFilePath,
	} as Express.Multer.File;
};

describe("AssetsController", () => {
	afterEach(async () => {
		await Promise.all(
			createdTemporaryAssetFilePaths.splice(0).map((temporaryFilePath) =>
				rm(temporaryFilePath, { force: true }),
			),
		);
	});

	it("uploadAsset interceptor는 제한된 임시 디스크 multipart 업로드 제한을 적용해야 한다", () => {
		const descriptor = Object.getOwnPropertyDescriptor(
			AssetsController.prototype,
			"uploadAsset",
		);
		const interceptors = Reflect.getMetadata(
			INTERCEPTORS_METADATA,
			descriptor?.value,
		) as Type<AssetUploadInterceptor>[];
		const AssetUploadInterceptor = interceptors.at(0);

		expect(AssetUploadInterceptor).toBeDefined();
		if (!AssetUploadInterceptor) {
			throw new Error("uploadAsset interceptor가 등록되지 않았습니다");
		}

		const uploadInterceptor = new AssetUploadInterceptor();

		expect(uploadInterceptor.multer.limits).toEqual({
			fileSize: 25 * 1024 * 1024,
			files: 1,
			fields: 1,
			parts: 3,
			fieldNameSize: 32,
			fieldSize: 64,
			headerPairs: 16,
			fieldNestingDepth: 0,
			fieldArrayIndexLimit: 0,
		});
		expect(uploadInterceptor.multer.storage).toEqual(
			expect.objectContaining({ getDestination: expect.any(Function) }),
		);
	});

	it("허용 MIME 타입과 매직 바이트가 일치하는 임시 파일만 업로드한다", async () => {
		const pngFile = await createTemporaryAssetUploadFile(
			"image/png",
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		);

		await expect(validateUploadedAssetFile(pngFile)).resolves.toBeUndefined();
	});

	it("요청 MIME 타입을 위장한 임시 파일은 CommandBus에 전달하기 전에 거부한다", async () => {
		const disguisedPdfFile = await createTemporaryAssetUploadFile(
			"image/png",
			Buffer.from("%PDF-1.7", "ascii"),
		);

		await expect(validateUploadedAssetFile(disguisedPdfFile)).rejects.toThrow(
			BadRequestException,
		);
	});

	it("위장된 파일을 받은 uploadAsset은 Command를 실행하지 않고 임시 파일을 삭제한다", async () => {
		const commandBus = { execute: jest.fn() };
		const controller = new AssetsController(
			commandBus as unknown as CommandBus,
			{} as QueryBus,
			{ user: { id: 1n } } as AuthContext,
		);
		const disguisedPdfFile = await createTemporaryAssetUploadFile(
			"image/png",
			Buffer.from("%PDF-1.7", "ascii"),
		);

		await expect(
			controller.uploadAsset({ folderId: 1n } as UploadAssetDto, disguisedPdfFile),
		).rejects.toThrow(BadRequestException);
		expect(commandBus.execute).not.toHaveBeenCalled();
		await expect(rm(disguisedPdfFile.path, { force: false })).rejects.toThrow();
	});

	it("파일 크기 제한을 넘는 파일은 매직 바이트가 유효해도 거부한다", async () => {
		const oversizedPngFile = await createTemporaryAssetUploadFile(
			"image/png",
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
			ASSET_UPLOAD_LIMITS.fileSize + 1,
		);

		await expect(validateUploadedAssetFile(oversizedPngFile)).rejects.toThrow(
			BadRequestException,
		);
	});

	it("업로드 Command가 성공하면 임시 파일을 삭제한다", async () => {
		const commandBus = {
			execute: jest.fn().mockResolvedValue({ id: "asset-1" }),
		};
		const controller = new AssetsController(
			commandBus as unknown as CommandBus,
			{} as QueryBus,
			{ user: { id: 1n } } as AuthContext,
		);
		const pngFile = await createTemporaryAssetUploadFile(
			"image/png",
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		);

		await expect(
			controller.uploadAsset({ folderId: 1n } as UploadAssetDto, pngFile),
		).resolves.toEqual({ id: "asset-1" });
		await expect(rm(pngFile.path, { force: false })).rejects.toThrow();
	});

	it("업로드 Command가 실패해도 임시 파일을 삭제한다", async () => {
		const commandBus = {
			execute: jest.fn().mockRejectedValue(new Error("storage failed")),
		};
		const controller = new AssetsController(
			commandBus as unknown as CommandBus,
			{} as QueryBus,
			{ user: { id: 1n } } as AuthContext,
		);
		const pngFile = await createTemporaryAssetUploadFile(
			"image/png",
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		);

		await expect(
			controller.uploadAsset({ folderId: 1n } as UploadAssetDto, pngFile),
		).rejects.toThrow("storage failed");
		await expect(rm(pngFile.path, { force: false })).rejects.toThrow();
	});

	it("Multer 단계에서도 허용 목록 밖의 MIME 타입을 거부한다", () => {
		const fileFilterCallback = jest.fn();
		const fileFilter = ASSET_UPLOAD_OPTIONS.fileFilter;
		if (!fileFilter) {
			throw new Error("asset upload fileFilter가 등록되지 않았습니다");
		}

		fileFilter(
			{},
			{ mimetype: "text/html" } as Express.Multer.File,
			fileFilterCallback,
		);

		expect(fileFilterCallback).toHaveBeenCalledWith(
			expect.any(BadRequestException),
			false,
		);
	});
});
