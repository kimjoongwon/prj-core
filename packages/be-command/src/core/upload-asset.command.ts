import type { UploadAssetCommandInput } from "@cocrepo/input";
export class UploadAssetCommand implements UploadAssetCommandInput {
	readonly folderId!: UploadAssetCommandInput["folderId"];

	constructor(
		input: UploadAssetCommandInput,
		readonly file: Express.Multer.File | undefined,
		readonly createdById: string,
	) {
		Object.assign(this, input);
	}
}
