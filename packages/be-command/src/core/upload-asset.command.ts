import type { UploadAssetCommandInput } from "./upload-asset.input";
export class UploadAssetCommand {
	constructor(
		readonly input: UploadAssetCommandInput,
		readonly file: Express.Multer.File | undefined,
		readonly creatorId: string,
	) {}
}
