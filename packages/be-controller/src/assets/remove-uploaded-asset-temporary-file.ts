import { rm } from "node:fs/promises";
import { isAssetUploadTemporaryFilePath } from "./asset-upload.options";

export async function removeUploadedAssetTemporaryFile(
	file: Express.Multer.File | undefined,
): Promise<void> {
	if (!file?.path || !isAssetUploadTemporaryFilePath(file.path)) {
		return;
	}

	await rm(file.path, { force: true });
}
