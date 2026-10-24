import { AssetAggregate } from "@cocrepo/aggregate";
import { MoveAssetCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(MoveAssetCommand)
export class MoveAssetUseCase {
	constructor(private readonly assetService: AssetAggregate) {}

	execute(command: MoveAssetCommand): Promise<unknown> {
		return this.assetService.moveAsset(command.assetId, command);
	}
}
