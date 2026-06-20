import { AssetAggregate } from "@cocrepo/aggregate";
import { DeleteAssetCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteAssetCommand)
export class DeleteAssetUseCase implements ICommandHandler<DeleteAssetCommand> {
	constructor(private readonly assetService: AssetAggregate) {}

	async execute(command: DeleteAssetCommand): Promise<void> {
		await this.assetService.deleteAsset(command.assetId);
	}
}
