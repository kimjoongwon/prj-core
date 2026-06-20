import { AssetAggregate } from "@cocrepo/aggregate";
import { MoveAssetCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(MoveAssetCommand)
export class MoveAssetUseCase implements ICommandHandler<MoveAssetCommand> {
	constructor(private readonly assetService: AssetAggregate) {}

	execute(command: MoveAssetCommand): Promise<unknown> {
		return this.assetService.moveAsset(command.assetId, command.input);
	}
}
