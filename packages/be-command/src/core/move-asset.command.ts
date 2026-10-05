import type { MoveAssetCommandInput } from "@cocrepo/input";
export class MoveAssetCommand implements MoveAssetCommandInput {
	readonly targetFolderId!: MoveAssetCommandInput["targetFolderId"];

	constructor(
		readonly assetId: bigint,
		input: MoveAssetCommandInput,
	) {
		Object.assign(this, input);
	}
}
