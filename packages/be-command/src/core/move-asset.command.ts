import type { MoveAssetDto } from "@cocrepo/dto";

export class MoveAssetCommand {
	constructor(
		readonly assetId: string,
		readonly dto: MoveAssetDto,
	) {}
}
