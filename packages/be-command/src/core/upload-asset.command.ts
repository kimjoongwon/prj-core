import type {
	UploadedAssetFileInput,
	UploadAssetCommandInput,
} from "@cocrepo/input";
export class UploadAssetCommand implements UploadAssetCommandInput {
	readonly folderSeq!: UploadAssetCommandInput["folderSeq"];

	constructor(
		input: UploadAssetCommandInput,
		readonly file: UploadedAssetFileInput | undefined,
		readonly createdBySeq: bigint,
	) {
		Object.assign(this, input);
	}
}
