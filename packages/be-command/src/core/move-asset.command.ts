import type { MoveAssetCommandInput } from "./move-asset.input";
export class MoveAssetCommand {
	constructor(
		readonly assetId: string,
		readonly input: MoveAssetCommandInput,
	) {}
}
