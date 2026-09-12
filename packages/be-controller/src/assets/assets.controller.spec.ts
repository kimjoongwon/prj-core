import type { NestInterceptor, Type } from "@nestjs/common";
import { INTERCEPTORS_METADATA } from "@nestjs/common/constants";
import { ASSET_UPLOAD_LIMITS } from "./asset-upload.options";
import { AssetsController } from "./assets.controller";

type AssetUploadInterceptor = NestInterceptor & {
	multer: {
		limits: typeof ASSET_UPLOAD_LIMITS;
	};
};

describe("AssetsController", () => {
	it("uploadAsset interceptor는 메모리 기반 multipart 업로드 제한을 적용해야 한다", () => {
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
	});
});
