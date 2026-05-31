import type { UploadAssetDto } from "@cocrepo/dto";

export class UploadAssetCommand {
	constructor(
		readonly dto: UploadAssetDto,
		readonly file: Express.Multer.File | undefined,
		readonly creatorId: string,
	) {}
}
