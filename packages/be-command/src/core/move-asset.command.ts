import type { MoveAssetCommandInput } from "@cocrepo/input";
export class MoveAssetCommand implements MoveAssetCommandInput {
	readonly targetFolderId!: MoveAssetCommandInput["targetFolderId"];

	constructor(
		readonly assetSeq: bigint,
		input: MoveAssetCommandInput,
	) {
		Object.assign(this, input);
	}
}
